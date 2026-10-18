import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { addDays, addMonthsClamped, diffDays, formatLong, fromDayNumber, parseCivilDate, todayInSingapore, toDayNumber } from '../../src/domain/civil-date';
import { civil } from './helpers';
describe('hand-computed civil dates', () => {
    it.each([
        ['D1', '2026-10-08', 30, '2026-11-07'], ['D2', '2026-10-08', 21, '2026-10-29'], ['D3', '2026-10-08', 14, '2026-10-22'], ['D4', '2026-10-10', 14, '2026-10-24'], ['D5', '2026-01-31', 30, '2026-03-02'], ['D6', '2028-01-31', 30, '2028-03-01'], ['D7', '2028-02-29', 14, '2028-03-14'], ['D8 leap', '2028-02-28', 1, '2028-02-29'], ['D8 common', '2027-02-28', 1, '2027-03-01'], ['D9', '2026-12-20', 14, '2027-01-03'],
    ] as const)('%s: %s + %i days = %s', (_id, start, n, end) => expect(addDays(civil(start), n)).toBe(end));
    it.each([['2026-01-31', '2026-02-28'], ['2028-01-31', '2028-02-29'], ['2026-03-31', '2026-04-30'], ['2026-08-31', '2026-09-30'], ['2026-12-15', '2027-01-15']])('D10 %s + month = %s', (start, end) => expect(addMonthsClamped(civil(start!), 1)).toBe(end));
    it('D12 Singapore date crosses at 16:00 UTC', () => { expect(todayInSingapore(new Date('2026-10-21T16:30:00Z'))).toBe('2026-10-22'); expect(todayInSingapore(new Date('2026-10-21T15:59:59Z'))).toBe('2026-10-21'); });
    it.each(['2026-02-29', '2026-13-01', '2026-1-5', '1899-12-31', '2200-01-01', '2026-04-31'])('D14 strict invalid %s', s => expect(parseCivilDate(s)).toBeNull());
    it('D15 1000 arbitrary civil dates and increments round trip', () => {
        fc.assert(fc.property(fc.integer({ min: toDayNumber(civil('1900-01-01')), max: toDayNumber(civil('2199-12-31')) }), fc.integer({ min: 0, max: 400 }), (day, n) => {
            const d = fromDayNumber(day);
            expect(diffDays(d, addDays(d, n))).toBe(n);
            expect(fromDayNumber(toDayNumber(d))).toBe(d);
        }), { numRuns: 1000 });
    });
    it('known epoch and century boundaries', () => { expect(toDayNumber(civil('1970-01-01'))).toBe(0); expect(toDayNumber(civil('1969-12-31'))).toBe(-1); expect(addDays(civil('1900-02-28'), 1)).toBe('1900-03-01'); expect(addDays(civil('2000-02-28'), 1)).toBe('2000-02-29'); });
    it.each([['2026-10-06', 'Tue 6 Oct 2026'], ['2026-10-08', 'Thu 8 Oct 2026'], ['2026-10-10', 'Sat 10 Oct 2026'], ['2026-10-20', 'Tue 20 Oct 2026'], ['2026-10-22', 'Thu 22 Oct 2026'], ['2026-10-24', 'Sat 24 Oct 2026'], ['2026-10-27', 'Tue 27 Oct 2026'], ['2026-10-29', 'Thu 29 Oct 2026'], ['2026-11-05', 'Thu 5 Nov 2026'], ['2026-11-07', 'Sat 7 Nov 2026']])('§14 weekday %s', (date, expected) => expect(formatLong(civil(date!))).toBe(expected));
});
