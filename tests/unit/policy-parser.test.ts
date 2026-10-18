import { it, expect } from 'vitest';
import fc from 'fast-check';
import { analysePolicy } from '../../src/domain/policy-parser';
import { verifySpan } from '../../src/domain/spans';
import { computeCase } from '../../src/domain/engine';
import { governingClauses } from '../../src/domain/matcher';
import { civil, demo, now, policy, policyText, simple } from './helpers';
it('W1 demo clauses have independently located passages and exact nested spans', () => {
    const p = policy();
    expect(p.clauses).toHaveLength(4);
    const [c1, c2, c3, c4] = p.clauses;
    expect(c1).toMatchObject({ id: 'c1', kind: 'window', window: { amount: 30, unit: 'days' }, anchor: { value: 'purchase' }, scope: { type: 'categories', categories: ['apparel', 'footwear'] } });
    expect(c2).toMatchObject({ id: 'c2', window: { amount: 14, unit: 'days' }, anchor: { value: 'unspecified', span: null }, scope: { type: 'categories', categories: ['electronics'] } });
    expect(c3).toMatchObject({ id: 'c3', kind: 'exclusion', window: null, scope: { type: 'marked', marker: 'final_sale' } });
    expect(c4).toMatchObject({ id: 'c4', window: { amount: 21, unit: 'days' }, anchor: { value: 'purchase' }, scope: { type: 'default', span: { text: 'All other items' } } });
    const quotes = ['Apparel and footwear may be returned within 30 days of purchase with tags attached.', 'Electronics may be returned within 14 days if unopened.', 'Clearance items marked FINAL SALE are not eligible for return.', 'All other items may be returned within 21 days of the date of purchase.'];
    quotes.forEach((quote, i) => expect(p.clauses[i]!.span).toEqual({ start: policyText.indexOf(quote), end: policyText.indexOf(quote) + quote.length, text: quote }));
    for (const [fragment, span] of [['30 days', c1!.window!.span], ['of purchase', c1!.anchor.span], ['14 days', c2!.window!.span], ['All other items', c4!.scope.type === 'default' ? c4!.scope.span : null]] as const)
        expect(span).toEqual({ start: policyText.indexOf(fragment), end: policyText.indexOf(fragment) + fragment.length, text: fragment });
});
it.each([
    ['W2', 'Items can be returned within thirty (30) days of delivery.', 30, 'days', 'delivery'],
    ['W3', 'Returns accepted within fourteen days from the date you receive your order.', 14, 'days', 'delivery'],
    ['W4', 'Electronics may be returned within 10 business days of purchase.', 10, 'business_days', 'purchase'],
    ['W9', 'You may return most items within 1 month of purchase.', 1, 'months', 'purchase'],
    ['W10', 'Returns within 30 days of purchase or delivery, whichever is later.', 30, 'days', 'unspecified'],
])('%s grammar', (_id, text, amount, unit, anchor) => { const c = policy(text).clauses; expect(c).toHaveLength(1); expect(c[0]).toMatchObject({ window: { amount, unit }, anchor: { value: anchor } }); });
it('W4 business days remain unsupported', () => expect(computeCase(simple('Electronics may be returned within 10 business days of purchase.', '2026-10-08', 'Earbuds'), now).items[0]!.outcome).toEqual({ status: 'unsupported', reason: 'business_days', clauseId: 'c1' }));
it('W5 differing footwear windows conflict with both evidence ids', () => { const s = simple('Shoes may be returned within 30 days of purchase. Shoes may be returned within 14 days of purchase.', '2026-10-08', 'Shoes'); expect(governingClauses(s.receipt!.items[0]!, s.policy!).kind).toBe('conflict'); expect(computeCase(s, now).items[0]!.outcome).toEqual({ status: 'conflict', clauseIds: ['c1', 'c2'] }); });
it('W6 no return keyword means no window and explicit refusal', () => { const s = simple('Enjoy 365 days of happiness with our products!'); expect(s.policy!.clauses).toHaveLength(0); expect(computeCase(s, now).refusal).toEqual({ code: 'no_window_in_policy' }); });
it('W7 refund-processing period is not a return clock', () => expect(policy('Refunds are issued to the original payment method within 5–7 business days of approval.').clauses).toEqual([]));
it('W8 disagreeing word and digits invalidate the window', () => expect(policy('Return within thirty (14) days of purchase.').clauses).toEqual([]));
it('W9 month-end clamps in the engine', () => expect(computeCase(simple('You may return most items within 1 month of purchase.', '2026-01-31'), now).items[0]!.outcome).toMatchObject({ status: 'computed', deadline: '2026-02-28' }));
it('W10 shared preposition still makes both anchors ambiguous', () => expect(computeCase(simple('Returns within 30 days of purchase or delivery, whichever is later.'), now).items[0]!.outcome).toMatchObject({ status: 'needs_answer', earliestPossible: '2026-11-07' }));
it('W11 newline normalization preserves normalized offsets and clauses', () => { const crlf = policy(policyText.replace(/\n/g, '\r\n')); expect(crlf.text).not.toContain('\r'); expect(crlf.clauses).toEqual(policy().clauses); });
it('W12 500 randomized Unicode and bullet combinations preserve every nested span', () => {
    const template = fc.constantFrom('Apparel returns within 30 days of purchase.', 'Electronics returns within 14 days if unopened.', 'Items marked FINAL SALE cannot be returned.', 'Return most items within thirty (30) days of delivery.', 'No return window here!', 'Refunds are processed within 10 days.', 'Refunds will be credited within 14 days of receiving your return.', 'Returns are accepted within 30 days of purchase, and refunds are issued within 10 days.', "Items may be returned within 30 days of purchase. We'll refund you within 14 days after we receive your return.", 'Electronics may be returned within 14 days of purchase, except opened software, which cannot be returned.', 'Electronics cannot be returned.', 'Home returns within 2 weeks from purchase; Shoes returns within 1 month after delivery.');
    fc.assert(fc.property(fc.array(fc.tuple(fc.constantFrom('', '  ', '\t', '• ', '1. ', '- ', '😀 é — “ ” '), template, fc.constantFrom('', '  ', '\t')), { minLength: 1, maxLength: 8 }), chunks => {
        const text = chunks.map(c => c.join('')).join('\n'), p = analysePolicy('fuzz', text, civil('2026-10-18'), '0'.repeat(64));
        for (const c of p.clauses) {
            expect(verifySpan(p.text, c.span)).toBe(true);
            const nested = [c.window?.span, c.anchor.span, ...(c.scope.type === 'categories' ? c.scope.spans : [c.scope.span])];
            for (const span of nested) {
                if (span) {
                    expect(verifySpan(p.text, span)).toBe(true);
                    expect(span.start).toBeGreaterThanOrEqual(c.span.start);
                    expect(span.end).toBeLessThanOrEqual(c.span.end);
                }
            }
        }
    }), { numRuns: 500 });
});
it('duplicate identical windows use the first; category outranks default; exclusions outrank windows', () => {
    const p = policy('All other items return within 60 days of purchase. Apparel return within 30 days of purchase. Apparel return within 30 days of purchase. Apparel cannot be returned.');
    expect(governingClauses(demo().receipt!.items[1]!, p)).toMatchObject({ kind: 'exclusion', clauses: [{ id: 'c4' }] });
    const s = simple('All other items return within 60 days of purchase. Apparel return within 30 days of purchase. Apparel return within 30 days of purchase.');
    expect(computeCase(s, now).items[0]!.outcome).toMatchObject({ status: 'computed', deadline: '2026-11-07', clauseId: 'c2' });
});
it('separate category phrases split multiple windows; unsplit competing windows conflict', () => {
    const p = policy('Returns: apparel within 30 days of purchase, footwear within 14 days of purchase.');
    expect(p.clauses).toHaveLength(2);
    expect(p.clauses[0]).toMatchObject({ window: { amount: 30 }, scope: { type: 'categories', categories: ['apparel'] }, anchor: { value: 'purchase' } });
    expect(p.clauses[1]).toMatchObject({ window: { amount: 14 }, scope: { type: 'categories', categories: ['footwear'] }, anchor: { value: 'purchase' } });
    const s = simple('Return apparel within 30 days or 14 days of purchase.');
    expect(computeCase(s, now).items[0]!.outcome).toEqual({ status: 'conflict', clauseIds: ['c1', 'c2'] });
});

it('W13 refund processing alone supplies no window and refuses the case', () => {
    const text = 'Refunds are processed within 10 days.';
    expect(policy(text).clauses).toEqual([]);
    expect(computeCase(simple(text), now).refusal).toEqual({ code: 'no_window_in_policy' });
});
it('W14 credit after receiving a return is processing, never a delivery clock', () => {
    expect(policy('Refunds will be credited within 14 days of receiving your return.').clauses).toEqual([]);
});
it('W15 mixed return and refund clocks keep only the genuine return window', () => {
    const text = 'Returns are accepted within 30 days of purchase, and refunds are issued within 10 days.';
    const p = policy(text);
    expect(p.clauses).toHaveLength(1);
    expect(p.clauses[0]).toMatchObject({ kind: 'window', window: { amount: 30, unit: 'days', span: { text: '30 days' } }, anchor: { value: 'purchase' }, scope: { type: 'default' } });
    expect(computeCase(simple(text), now).items[0]!.outcome).toMatchObject({ status: 'computed', deadline: '2026-11-07', start: { date: '2026-10-08', basis: 'purchase' }, window: { amount: 30, unit: 'days' } });
});
it('W16 refund processing after a return sentence does not add a second window', () => {
    const p = policy("Items may be returned within 30 days of purchase. We'll refund you within 14 days after we receive your return.");
    expect(p.clauses).toHaveLength(1);
    expect(p.clauses[0]).toMatchObject({ kind: 'window', window: { amount: 30, unit: 'days' }, anchor: { value: 'purchase' } });
});
it('W17 a conditional exclusion preserves the electronics window and full passage', () => {
    const text = 'Electronics may be returned within 14 days of purchase, except opened software, which cannot be returned.';
    const p = policy(text);
    expect(p.clauses).toHaveLength(1);
    expect(p.clauses[0]).toMatchObject({ kind: 'window', span: { text }, window: { amount: 14, unit: 'days' }, anchor: { value: 'purchase' }, scope: { type: 'categories', categories: ['electronics'] } });
    expect(computeCase(simple(text, '2026-10-08', 'Earbuds'), now).items[0]!.outcome).toMatchObject({ status: 'computed', deadline: '2026-10-22', start: { date: '2026-10-08', basis: 'purchase' } });
});
it('W18 a pure electronics exclusion remains not returnable', () => {
    const text = 'Electronics cannot be returned.';
    expect(policy(text).clauses).toHaveLength(1);
    expect(policy(text).clauses[0]).toMatchObject({ kind: 'exclusion', window: null, scope: { type: 'categories', categories: ['electronics'] } });
    // The separate default window avoids the case-wide no-window refusal,
    // so this checks exclusion precedence through the engine as well.
    expect(computeCase(simple(text + '\nAll other items may be returned within 30 days of purchase.', '2026-10-08', 'Earbuds'), now).items[0]!.outcome).toEqual({ status: 'not_returnable', clauseId: 'c1' });
});
