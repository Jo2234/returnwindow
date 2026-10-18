import { it, expect } from 'vitest';
import { computeCase } from '../../src/domain/engine';
import { demo, now } from './helpers';
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
