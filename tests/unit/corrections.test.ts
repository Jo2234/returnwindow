import { it, expect } from 'vitest';
import { applyCorrection } from '../../src/domain/corrections';
import type { CaseState, Correction } from '../../src/domain/types';
import { computeCase } from '../../src/domain/engine';
import { answered, demo, now, simple } from './helpers';
const edit = (s: CaseState, target: Correction['target'], value: unknown) => applyCorrection(s, { target, to: String(value), at: '2026-10-20T04:00:00Z' }, value);
it('corrections set confidence and origin; correct description reroutes category and marker', () => {
    const s = demo(), changed = edit(s, { field: 'item.description', itemId: 'item-3' }, 'Headphones FINAL SALE');
    if ('error' in changed)
        throw new Error(changed.error.code);
    expect(s.receipt!.items[2]!.description.value).toBe('Stoneware Mug');
    expect(changed.state.receipt!.items[2]).toMatchObject({ id: 'item-3', description: { value: 'Headphones FINAL SALE', origin: 'corrected', confidence: 100, needsCheck: false, note: null }, category: { value: 'electronics', origin: 'lexicon' }, marker: { finalSale: true } });
    expect(computeCase(changed.state, now).items[2]!.outcome).toEqual({ status: 'not_returnable', clauseId: 'c3' });
});
it('store/amount correction records previous display, provenance and preserves date results', () => {
    const s = demo(), initial = computeCase(s, now);
    const store = edit(s, { field: 'store' }, 'Juniper Lane Goods');
    if ('error' in store)
        throw new Error(store.error.code);
    expect(store.state.receipt!.store).toMatchObject({ value: 'Juniper Lane Goods', origin: 'corrected', confidence: 100, needsCheck: false });
    expect(store.state.corrections[0]!.from).toBe('JUNIPER LANE GOODS');
    const amount = edit(store.state, { field: 'item.amountCents', itemId: 'item-2' }, 4600);
    if ('error' in amount)
        throw new Error(amount.error.code);
    expect(amount.state.receipt!.items[1]!.amountCents).toMatchObject({ value: 4600, origin: 'corrected', confidence: 100, needsCheck: false });
    expect(amount.state.corrections[1]).toMatchObject({ id: 'k2', from: '45.90' });
    expect(computeCase(amount.state, now).items).toEqual(initial.items);
});
it('answer correction replaces rather than duplicates and logs the old answer', () => {
    const s = answered('purchase'), changed = edit(s, { field: 'answer', questionId: 'clock:c2' }, 'unsure');
    if ('error' in changed)
        throw new Error(changed.error.code);
    expect(changed.state.answers).toEqual([{ questionId: 'clock:c2', choice: 'unsure', at: '2026-10-20T04:00:00Z' }]);
    expect(changed.state.corrections[0]!.from).toBe('purchase');
    expect(s.answers[0]!.choice).toBe('purchase');
});
it('changing purchase beyond known delivery also rejects', () => expect(edit(answered('delivery', '2026-10-10'), { field: 'purchaseDate' }, '2026-10-11')).toEqual({ error: { code: 'delivery_before_purchase' } }));
it.each(['2026-02-29', '31/02/2026', '', null])('invalid corrected date %s does not mutate', value => { const s = demo(), before = JSON.stringify(s); expect(edit(s, { field: 'purchaseDate' }, value)).toEqual({ error: { code: 'invalid_date' } }); expect(JSON.stringify(s)).toBe(before); });
it.each([-1, 1.5, NaN, Infinity, '12.00'])('invalid amount cents %s rejects', value => expect(edit(demo(), { field: 'item.amountCents', itemId: 'item-2' }, value)).toEqual({ error: { code: 'invalid_amount' } }));
it('unknown item, empty store, empty description and invalid category reject', () => {
    expect(edit(demo(), { field: 'item.description', itemId: 'missing' }, 'shirt')).toEqual({ error: { code: 'unknown_item' } });
    expect(edit(demo(), { field: 'store' }, '  ')).toEqual({ error: { code: 'empty_value' } });
    expect(edit(demo(), { field: 'item.description', itemId: 'item-1' }, '')).toEqual({ error: { code: 'empty_value' } });
    expect(edit(demo(), { field: 'item.category', itemId: 'item-1' }, 'unknown')).toEqual({ error: { code: 'empty_value' } });
});
it('manual category choice survives description edits', () => {
    const c = edit(demo(), { field: 'item.category', itemId: 'item-3' }, 'electronics');
    if ('error' in c)
        throw new Error(c.error.code);
    const d = edit(c.state, { field: 'item.description', itemId: 'item-3' }, 'Stoneware Bowl');
    if ('error' in d)
        throw new Error(d.error.code);
    expect(d.state.receipt!.items[2]!.category).toEqual({ value: 'electronics', origin: 'corrected', keyword: null });
});
it('two ambiguous clauses produce ordered questions; answering one exposes the next', () => {
    const s = simple('Apparel returns within 30 days. Home returns within 21 days.');
    s.receipt!.items.push(demo().receipt!.items[2]!);
    const r = computeCase(s, now);
    expect(r.questions.map(q => q.id)).toEqual(['clock:c1', 'clock:c2']);
    const a = edit(s, { field: 'answer', questionId: 'clock:c1' }, 'purchase');
    if ('error' in a)
        throw new Error(a.error.code);
    expect(computeCase(a.state, now).questions.map(q => q.id)).toEqual(['clock:c2']);
});
