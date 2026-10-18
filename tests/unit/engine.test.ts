import { it, expect } from 'vitest';
import { computeCase } from '../../src/domain/engine';
import { emptyCase } from '../../src/state/case-store';
import { civil, demo, now, simple } from './helpers';
it('D11 two weeks use 14 calendar days', () => expect(computeCase(simple('Return all items within 2 weeks of purchase.'), now).items[0]!.outcome).toMatchObject({ deadline: '2026-10-22', window: { amount: 2, unit: 'weeks' } }));
it.each([['2026-10-22', 0, 'last_day'], ['2026-10-21', -1, 'closed'], ['2026-10-25', 3, 'closing_soon'], ['2026-10-26', 4, 'open']] as const)('D13 deadline %s urgency', (date, daysLeft, urgency) => { const s = simple('Return all items within 0 days of purchase.', date); expect(computeCase(s, new Date('2026-10-22T04:00:00Z')).items[0]).toMatchObject({ daysLeft, urgency }); });
it('refusal for absent policy, no windows and absent receipt; never dates or questions', () => {
    for (const s of [Object.assign(demo(), { policy: null }), simple('No return promises.'), Object.assign(emptyCase(), { policy: demo().policy })]) {
        const r = computeCase(s, now);
        expect(r.refusal).not.toBeNull();
        expect(r.questions).toEqual([]);
        expect(r.items.every(i => !('deadline' in i.outcome))).toBe(true);
    }
    expect(computeCase(Object.assign(demo(), { policy: null }), now).refusal).toEqual({ code: 'no_policy' });
    expect(computeCase(Object.assign(emptyCase(), { policy: demo().policy }), now).refusal).toEqual({ code: 'no_receipt' });
});
it('uncovered item is never given a default date', () => expect(computeCase(simple('Electronics return within 14 days of purchase.'), now).items[0]!.outcome).toEqual({ status: 'no_policy_match' }));
it('explicit delivery needs a date and one delivery question', () => { const s = simple('All items return within 14 days of delivery.'); const r = computeCase(s, now); expect(r.items[0]!.outcome).toEqual({ status: 'missing_input', field: 'deliveryDate', clauseId: 'c1' }); expect(r.questions).toEqual([{ id: 'delivery:c1', kind: 'delivery_date', clauseId: 'c1', itemIds: ['item-1'], prompt: 'When was your order delivered?' }]); s.deliveryDate.value = civil('2026-10-10'); expect(computeCase(s, now).items[0]!.outcome).toMatchObject({ status: 'computed', deadline: '2026-10-24', start: { basis: 'delivery', via: 'policy' } }); });
it('E1 same Singapore civil day gives identical result; E2–E4 supported evidence and arithmetic', () => {
    const s = demo(), a = computeCase(s, now);
    expect(computeCase(s, new Date('2026-10-20T15:59:59Z'))).toEqual(a);
    for (const r of a.items) {
        expect('deadline' in r.outcome).toBe(r.outcome.status === 'computed');
        if ('clauseId' in r.outcome) {
            const clauseId = r.outcome.clauseId;
            expect(s.policy!.clauses.some(c => c.id === clauseId)).toBe(true);
        }
    }
    expect(a.items[1]!.outcome).toMatchObject({ deadline: '2026-11-07', start: { date: '2026-10-08' } });
});
