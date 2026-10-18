import { it, expect } from 'vitest';
import { computeCase } from '../../src/domain/engine';
import { answered, civil, demo, now } from './helpers';
import { applyCorrection } from '../../src/domain/corrections';
it('§10.2 exact four-item demo, initial outcomes and one clause question', () => {
    const s = demo(), r = computeCase(s, now);
    expect(s.receipt!.store.value).toBe('JUNIPER LANE GOODS');
    expect(s.receipt!.purchaseDate).toMatchObject({ value: '2026-10-08', needsCheck: true, note: 'Read as day/month (Singapore format)' });
    expect(s.receipt!.totalCents.value).toBe(16540);
    expect(s.receipt!.warnings).toEqual([]);
    expect(s.receipt!.items.map(i => [i.category.value, i.marker.finalSale])).toEqual([['electronics', false], ['apparel', false], ['home', false], ['apparel', true]]);
    expect(r.items).toEqual([
        { itemId: 'item-1', outcome: { status: 'needs_answer', questionId: 'clock:c2', clauseId: 'c2', earliestPossible: '2026-10-22' }, daysLeft: null, urgency: null },
        { itemId: 'item-2', outcome: { status: 'computed', deadline: '2026-11-07', start: { date: '2026-10-08', basis: 'purchase', via: 'policy' }, window: { amount: 30, unit: 'days' }, clauseId: 'c1' }, daysLeft: 18, urgency: 'open' },
        { itemId: 'item-3', outcome: { status: 'computed', deadline: '2026-10-29', start: { date: '2026-10-08', basis: 'purchase', via: 'policy' }, window: { amount: 21, unit: 'days' }, clauseId: 'c4' }, daysLeft: 9, urgency: 'open' },
        { itemId: 'item-4', outcome: { status: 'not_returnable', clauseId: 'c3' }, daysLeft: null, urgency: null },
    ]);
    expect(r.questions).toEqual([{ id: 'clock:c2', kind: 'clock_start', clauseId: 'c2', itemIds: ['item-1'], prompt: 'This passage says “14 days” but not when the clock starts. Does it start on the purchase date (Thu 8 Oct 2026) or when the order was delivered?' }]);
});
it('delivery answer gives 24 Oct via answer with no remaining questions', () => {
    const r = computeCase(answered('delivery', '2026-10-10'), now);
    expect(r.items[0]!.outcome).toEqual({ status: 'computed', deadline: '2026-10-24', start: { date: '2026-10-10', basis: 'delivery', via: 'answer' }, window: { amount: 14, unit: 'days' }, clauseId: 'c2' });
    expect(r.items[0]!.daysLeft).toBe(4);
    expect(r.questions).toEqual([]);
});
it('purchase answer gives 22 Oct; unsure keeps only labelled earliest possible date', () => {
    expect(computeCase(answered('purchase'), now).items[0]!.outcome).toMatchObject({ status: 'computed', deadline: '2026-10-22', start: { basis: 'purchase', via: 'answer' } });
    const unsure = computeCase(answered('unsure'), now);
    expect(unsure.items[0]!.outcome).toEqual({ status: 'unsure', clauseId: 'c2', earliestPossible: '2026-10-22' });
    expect(unsure.items[0]!.daysLeft).toBeNull();
    expect(unsure.questions).toEqual([]);
    expect('deadline' in unsure.items[0]!.outcome).toBe(false);
});
it('video correction shifts only purchase-based deadlines, log grows once, C1 restores all results', () => {
    const original = answered('delivery', '2026-10-10');
    original.receipt!.purchaseDate.value = civil('2026-10-06');
    const before = computeCase(original, now);
    expect(before.items.map(r => r.outcome.status === 'computed' ? r.outcome.deadline : r.outcome.status)).toEqual(['2026-10-24', '2026-11-05', '2026-10-27', 'not_returnable']);
    const edit = applyCorrection(original, { target: { field: 'purchaseDate' }, to: '08 Oct 2026', at: '2026-10-20T04:00:00Z' }, '2026-10-08');
    if ('error' in edit)
        throw new Error(edit.error.code);
    const after = computeCase(edit.state, now);
    expect(after.items.map(r => r.outcome.status === 'computed' ? r.outcome.deadline : r.outcome.status)).toEqual(['2026-10-24', '2026-11-07', '2026-10-29', 'not_returnable']);
    expect(after.items[0]).toEqual(before.items[0]);
    expect(edit.state.corrections).toEqual([{ id: 'k1', at: '2026-10-20T04:00:00Z', target: { field: 'purchaseDate' }, from: '06 Oct 2026', to: '08 Oct 2026' }]);
    expect(original.corrections).toEqual([]);
    expect(original.receipt!.purchaseDate.value).toBe('2026-10-06');
    const revert = applyCorrection(edit.state, { target: { field: 'purchaseDate' }, to: '06 Oct 2026', at: '2026-10-20T04:01:00Z' }, '2026-10-06');
    if ('error' in revert)
        throw new Error(revert.error.code);
    const roundTrip = computeCase(revert.state, now);
    expect(roundTrip.items).toEqual(before.items);
    expect(roundTrip.questions).toEqual(before.questions);
    expect(revert.state.corrections).toHaveLength(2);
});
it('category correction shares an answered clock; clearing answer leaves one question for two items', () => {
    const edit = applyCorrection(answered('delivery', '2026-10-10'), { target: { field: 'item.category', itemId: 'item-3' }, to: 'electronics', at: '2026-10-20T04:00:00Z' }, 'electronics');
    if ('error' in edit)
        throw new Error(edit.error.code);
    const r = computeCase(edit.state, now);
    expect(r.items[2]!.outcome).toMatchObject({ status: 'computed', deadline: '2026-10-24', clauseId: 'c2' });
    expect(r.questions).toHaveLength(0);
    expect(edit.state.receipt!.items[2]!.category.origin).toBe('corrected');
    const cleared = structuredClone(edit.state);
    cleared.answers = [];
    const pending = computeCase(cleared, now);
    expect(pending.questions).toHaveLength(1);
    expect(pending.questions[0]!.itemIds).toEqual(['item-1', 'item-3']);
});
it('delivery before purchase rejects and leaves the original state byte-for-byte unchanged', () => {
    const s = demo(), before = JSON.stringify(s);
    expect(applyCorrection(s, { target: { field: 'deliveryDate' }, to: '05 Oct 2026', at: '2026-10-20T04:00:00Z' }, '2026-10-05')).toEqual({ error: { code: 'delivery_before_purchase' } });
    expect(JSON.stringify(s)).toBe(before);
});
