import { expect, it } from 'vitest';
import ICAL from 'ical.js';
import { buildIcs } from '../../src/domain/ics';
import { computeCase, DATE_CONVENTION } from '../../src/domain/engine';
import { answered, civil, demo, now, policy } from './helpers';
const parse = (text: string) => new ICAL.Component(ICAL.parse(text));
it('I1 independent parser verifies all-day dates, verbatim store, stable ids, UTC stamps and absolute SGT alarms', () => {
    const s = answered('delivery', '2026-10-10'), output = buildIcs(s, computeCase(s, now), now), calendar = parse(output.text);
    expect(calendar.getFirstPropertyValue('prodid')).toBe('-//ReturnWindow//EN');
    expect(calendar.getFirstPropertyValue('version')).toBe('2.0'); expect(calendar.getFirstPropertyValue('method')).toBe('PUBLISH');
    const events = calendar.getAllSubcomponents('vevent'); expect(events).toHaveLength(3);
    expect(output.included).toEqual(['item-1', 'item-2', 'item-3']);
    const expected = [
        ['item-1', '2026-10-24', '2026-10-25', '2026-10-23T01:00:00Z'],
        ['item-2', '2026-11-07', '2026-11-08', '2026-11-06T01:00:00Z'],
        ['item-3', '2026-10-29', '2026-10-30', '2026-10-28T01:00:00Z'],
    ];
    events.forEach((event, index) => {
        const [id, start, end, alarm] = expected[index]!;
        const dtstart = (event.getFirstPropertyValue('dtstart') as ICAL.Time), dtend = (event.getFirstPropertyValue('dtend') as ICAL.Time);
        expect(dtstart.isDate).toBe(true); expect(dtstart.toString()).toBe(start); expect(dtend.isDate).toBe(true); expect(dtend.toString()).toBe(end);
        expect(event.getFirstPropertyValue('uid')).toBe(`${id}-${s.policy!.sha256.slice(0, 12)}@returnwindow.local`);
        expect((event.getFirstPropertyValue('dtstamp') as ICAL.Time).toString()).toBe('2026-10-20T04:00:00Z');
        const alarms = event.getAllSubcomponents('valarm'); expect(alarms).toHaveLength(1);
        expect(alarms[0]!.getFirstPropertyValue('action')).toBe('DISPLAY');
        const trigger = alarms[0]!.getFirstProperty('trigger')!;
        expect(trigger.type).toBe('date-time'); expect(trigger.getParameter('related')).toBeUndefined();
        expect((trigger.getFirstValue() as ICAL.Time).toString()).toBe(alarm);
        const description = (event.getFirstPropertyValue('description') as string);
        expect(description).toContain(DATE_CONVENTION);
        const clauseId = ['c2', 'c1', 'c4'][index]!; expect(description).toContain(s.policy!.clauses.find(c => c.id === clauseId)!.span.text);
    });
    expect(events[1]!.getFirstPropertyValue('summary')).toBe('Last day to return: Linen Shirt (M) — JUNIPER LANE GOODS');
    expect(output.text).toContain('TRIGGER;VALUE=DATE-TIME:20261023T010000Z');
    expect(output.text).toContain('TRIGGER;VALUE=DATE-TIME:20261106T010000Z');
    expect(output.text).toContain('TRIGGER;VALUE=DATE-TIME:20261028T010000Z'); expect(output.text).not.toContain('RELATED=');
});
it('I1 year boundary alarm is preceding 31 December at 01:00 UTC, not local midnight arithmetic', () => {
    const s = answered('purchase'); s.receipt!.purchaseDate.value = civil('2026-12-18');
    s.policy = policy('All items may be returned within 14 days of purchase.'); s.answers = [];
    const result = buildIcs(s, computeCase(s, now), now), event = parse(result.text).getFirstSubcomponent('vevent')!;
    expect((event.getFirstPropertyValue('dtstart') as ICAL.Time).toString()).toBe('2027-01-01');
    expect((event.getFirstPropertyValue('dtend') as ICAL.Time).toString()).toBe('2027-01-02');
    expect(result.text).toContain('TRIGGER;VALUE=DATE-TIME:20261231T010000Z');
});
it('I2 every physical line is CRLF and at most 75 UTF-8 octets; TEXT round-trips all escapes and Unicode', () => {
    const s = answered('delivery', '2026-10-10'), value = 'café — “quote” 🧾,semi;slash\\\nInjected: value '.repeat(6);
    s.receipt!.items[1]!.description.value = value; s.receipt!.store.value = 'A,B;C\\D\r\nSTORE';
    const output = buildIcs(s, computeCase(s, now), now).text;
    expect(output.endsWith('\r\n')).toBe(true); expect(output.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
    for (const line of output.split('\r\n')) expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75);
    expect(output).not.toContain('�'); expect(output).toContain('\\,'); expect(output).toContain('\\;'); expect(output).toContain('\\\\'); expect(output).toContain('\\n');
    expect(parse(output).getAllSubcomponents('vevent')[1]!.getFirstPropertyValue('summary')).toBe(`Last day to return: ${value} — A,B;C\\D\nSTORE`);
    expect(parse(output).getAllSubcomponents('vevent')).toHaveLength(3);
});
it('I3 excludes scarf, unsure and closed results with reasons; today is still eligible', () => {
    const s = answered('unsure'); const unsure = buildIcs(s, computeCase(s, now), now);
    expect(unsure.included).toEqual(['item-2', 'item-3']);
    expect(unsure.excluded).toEqual([{itemId:'item-1',reason:'Clock start not confirmed'},{itemId:'item-4',reason:'Not returnable'}]);
    const later = new Date('2026-10-29T04:00:00Z'), closed = answered('delivery', '2026-10-10');
    const output = buildIcs(closed, computeCase(closed, later), later);
    expect(output.included).toEqual(['item-2','item-3']); expect(output.excluded).toContainEqual({itemId:'item-1',reason:'Already passed'});
    expect(parse(output.text).getAllSubcomponents('vevent')).toHaveLength(2);
});
it('I4 refuses zero supported results and lists every exclusion rather than exporting guessed clocks', () => {
    const s=demo();s.policy=null;const output=buildIcs(s,computeCase(s,now),now);
    expect(output.included).toEqual([]);expect(output.excluded).toHaveLength(4);expect(parse(output.text).getAllSubcomponents('vevent')).toHaveLength(0);
});
