import type { CivilDate } from './types';
const leap = (y: number) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
const monthLength = (y: number, m: number) => [31, leap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1] ?? 0;
const parts = (d: CivilDate): [
    number,
    number,
    number
] => [Number(d.slice(0, 4)), Number(d.slice(5, 7)), Number(d.slice(8, 10))];
const civil = (y: number, m: number, d: number) => `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` as CivilDate;
export function parseCivilDate(s: string): CivilDate | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s))
        return null;
    const [y, m, d] = parts(s as CivilDate);
    return y >= 1900 && y <= 2199 && m >= 1 && m <= 12 && d >= 1 && d <= monthLength(y, m) ? s as CivilDate : null;
}
// Howard Hinnant's Gregorian era decomposition. Integer dates, independent of host TZ.
export function toDayNumber(d: CivilDate): number {
    let [y, m, day] = parts(d);
    y -= m <= 2 ? 1 : 0;
    const era = Math.floor(y / 400), yoe = y - era * 400;
    const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + day - 1;
    return era * 146097 + yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy - 719468;
}
export function fromDayNumber(n: number): CivilDate {
    const z = n + 719468, era = Math.floor(z / 146097), doe = z - era * 146097;
    const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
    let y = yoe + era * 400;
    const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100)), mp = Math.floor((5 * doy + 2) / 153);
    const day = doy - Math.floor((153 * mp + 2) / 5) + 1, m = mp + (mp < 10 ? 3 : -9);
    y += m <= 2 ? 1 : 0;
    return civil(y, m, day);
}
export const addDays = (d: CivilDate, n: number): CivilDate => fromDayNumber(toDayNumber(d) + n);
export function addMonthsClamped(d: CivilDate, n: number): CivilDate {
    const [y, m, day] = parts(d), total = y * 12 + m - 1 + n;
    const year = Math.floor(total / 12), month = total - year * 12 + 1;
    return civil(year, month, Math.min(day, monthLength(year, month)));
}
export const diffDays = (a: CivilDate, b: CivilDate): number => toDayNumber(b) - toDayNumber(a);
export function todayInSingapore(now: Date): CivilDate {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
    return `${p.find(x => x.type === 'year')!.value}-${p.find(x => x.type === 'month')!.value}-${p.find(x => x.type === 'day')!.value}` as CivilDate;
}
export function formatLong(d: CivilDate): string {
    const [y, m, day] = parts(d), weekday = ((toDayNumber(d) + 4) % 7 + 7) % 7;
    return `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][weekday]} ${day} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]} ${y}`;
}
