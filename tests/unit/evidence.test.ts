import { expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { buildEvidenceHtml } from '../../src/domain/evidence';
import { computeCase, DATE_CONVENTION } from '../../src/domain/engine';
import { applyCorrection } from '../../src/domain/corrections';
import { answered, civil, now, policy } from './helpers';
const { JSDOM } = createRequire(import.meta.url)('jsdom');
const documentOf = (html: string): Document => new JSDOM(html).window.document;
it('E1 independent DOM parser verifies exact passages, offsets, fingerprint, answers, corrections and disclosure', () => {
    const original = answered('delivery', '2026-10-10');
    const applied = applyCorrection(original, { target: { field: 'store' }, to: 'Corrected Store', at: '2026-10-20T04:01:00Z' }, 'Corrected Store');
    if ('error' in applied)
        throw new Error(applied.error.code);
    const state = applied.state, html = buildEvidenceHtml(state, computeCase(state, now), now, { receiptImageDataUrl: null }), doc = documentOf(html), body = doc.body.textContent!;
    expect(doc.querySelectorAll('blockquote')).toHaveLength(4);
    expect([...doc.querySelectorAll('blockquote')].map(q => q.textContent)).toEqual(state.policy!.clauses.map(c => c.span.text));
    for (const c of state.policy!.clauses)
        expect(body).toContain(`${c.span.start}–${c.span.end}`);
    for (const text of [state.policy!.sha256, state.policy!.label, '2026-10-18', DATE_CONVENTION, 'Sample data — synthetic', 'not legal advice', 'clock:c2: delivery', 'JUNIPER LANE GOODS → Corrected Store', 'store', 'Sat 7 Nov 2026']) {
        expect(body).toContain(text);
    }
    expect(doc.querySelector('script')).toBeNull();
    expect(doc.querySelectorAll('[src],[href]').length).toBe(0);
    expect(html).not.toMatch(/https?:\/\//);
    expect(html).toContain('@media print');
    expect(html).toContain('@page{size:A4;margin:16mm}');
});
it('E1 escapes every user text surface and rejects active/external image formats', () => {
    const s = answered('purchase'), evil = '<img src="https://attacker.invalid/a" onerror="alert(1)"><script>alert(2)</script>&"\'';
    s.receipt!.store.value = evil;
    s.receipt!.items[0]!.description.value = evil;
    s.policy = policy(`All items may be returned within 30 days of purchase ${evil}`);
    s.policy.label = evil;
    s.corrections = [{ id: 'k1', at: '2026-10-20T04:00:00Z', target: { field: 'store' }, from: evil, to: evil }];
    for (const image of ['https://attacker.invalid/image.png', 'data:image/svg+xml;base64,PHN2Zz4=', 'data:image/png;base64,AA==" onerror="alert(1)']) {
        const doc = documentOf(buildEvidenceHtml(s, computeCase(s, now), now, { receiptImageDataUrl: image }));
        expect(doc.querySelectorAll('script,img,iframe,object,link,base,form')).toHaveLength(0);
        expect([...doc.querySelectorAll('*')].flatMap(el => el.getAttributeNames()).filter(name => name.startsWith('on'))).toEqual([]);
        expect(doc.body.textContent).toContain(evil);
        expect(doc.querySelector('title')!.textContent).toContain(evil);
        expect(doc.querySelector('meta[http-equiv="Content-Security-Policy"]')!.getAttribute('content')).toContain("default-src 'none'");
    }
});
it('E1 embeds only an allowed in-memory raster data URL and no remote fetch attributes', () => {
    const s = answered('purchase'), image = 'data:image/png;base64,iVBORw0KGgo=';
    const doc = documentOf(buildEvidenceHtml(s, computeCase(s, now), now, { receiptImageDataUrl: image }));
    expect(doc.querySelector('img')!.getAttribute('src')).toBe(image);
    expect([...doc.querySelectorAll('[src],[href]')].every(el => (el.getAttribute('src') ?? '').startsWith('data:image/png;base64,'))).toBe(true);
});
it('E1 invalid policy spans are never quoted as evidence', () => {
    const s = answered('purchase');
    s.policy!.clauses[0]!.span.text = 'fabricated';
    const doc = documentOf(buildEvidenceHtml(s, computeCase(s, now), now, { receiptImageDataUrl: null }));
    expect(doc.querySelectorAll('blockquote')).toHaveLength(0);
    expect(doc.body.textContent).toContain('Evidence mismatch; quotations hidden.');
});
it('E1 closed deadlines remain in evidence with an explicit closed status', () => {
    const s = answered('delivery', '2026-10-10'), later = new Date('2026-10-29T04:00:00Z');
    const doc = documentOf(buildEvidenceHtml(s, computeCase(s, later), later, { receiptImageDataUrl: null }));
    expect(doc.querySelectorAll('tbody tr')[0]!.textContent).toContain('Closed — Sat 24 Oct 2026');
    expect(doc.body.textContent).toContain('Computed — Thu 29 Oct 2026');
});
it('E1 responsive rows retain semantic headers, all four results and the actual 05 → 08 correction', () => {
    const original = answered('delivery', '2026-10-10');
    original.receipt!.purchaseDate.value = civil('2026-10-05');
    const before = documentOf(buildEvidenceHtml(original, computeCase(original, now), now, { receiptImageDataUrl: null }));
    const statuses = (doc: Document) => [...doc.querySelectorAll('.item-results tbody tr')].map(row => row.querySelector('[headers="evidence-status"] .cell-value')!.textContent);
    expect(statuses(before)).toEqual(['Computed — Sat 24 Oct 2026', 'Computed — Wed 4 Nov 2026', 'Computed — Mon 26 Oct 2026', 'Not returnable (final sale)']);
    const applied = applyCorrection(original, { target: { field: 'purchaseDate' }, to: '08 Oct 2026', at: '2026-10-20T04:01:00Z' }, '2026-10-08');
    if ('error' in applied)
        throw new Error(applied.error.code);
    const doc = documentOf(buildEvidenceHtml(applied.state, computeCase(applied.state, now), now, { receiptImageDataUrl: null }));
    expect(statuses(doc)).toEqual(['Computed — Sat 24 Oct 2026', 'Computed — Sat 7 Nov 2026', 'Computed — Thu 29 Oct 2026', 'Not returnable (final sale)']);
    expect([...doc.querySelectorAll('[headers="evidence-item"] .cell-value')].map(el => el.textContent)).toEqual([
        'Wireless EarbudsSGD 89.00', 'Linen Shirt (M)SGD 45.90', 'Stoneware MugSGD 18.50', 'Wool Scarf CLEARANCE FINAL SALESGD 12.00',
    ]);
    expect([...doc.querySelectorAll('[headers="evidence-passage"] .cell-value')].map(el => el.textContent)).toEqual(['Passage 2', 'Passage 1', 'Passage 4', 'Passage 3']);
    expect(doc.querySelector('[headers="change-value"] .cell-value')!.textContent).toBe('05 Oct 2026 → 08 Oct 2026');
    for (const table of doc.querySelectorAll('table')) {
        expect(table.getAttribute('role')).toBe('table');
        expect(table.querySelector('thead')!.getAttribute('role')).toBe('rowgroup');
        for (const cell of table.querySelectorAll('tbody td')) {
            const header = doc.getElementById(cell.getAttribute('headers')!);
            expect(header?.tagName).toBe('TH');
            expect(header?.getAttribute('scope')).toBe('col');
            expect(cell.getAttribute('role')).toBe('cell');
            expect(cell.querySelector('.cell-label')!.textContent).toBe(header!.textContent);
            expect(cell.querySelector('.cell-label')!.getAttribute('aria-hidden')).toBe('true');
        }
    }
});
