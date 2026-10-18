import type { CaseResult, CaseState } from './types';
import { addDays, formatLong } from './civil-date';
import { DATE_CONVENTION } from './engine';
export const escapeIcsText = (text: string): string => text.replace(/\\/g, '\\\\').replace(/\r\n?|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
// Count UTF-8 octets, including the continuation space; never split a code point.
export function foldIcsLine(line: string): string {
    const encoder = new TextEncoder();
    let current = '', bytes = 0;
    const lines: string[] = [];
    for (const character of line) {
        const size = encoder.encode(character).length;
        if (bytes + size > 75) {
            lines.push(current);
            current = ' ';
            bytes = 1;
        }
        current += character;
        bytes += size;
    }
    lines.push(current);
    return lines.join('\r\n');
}
export function buildIcs(state: CaseState, result: CaseResult, now: Date): {
    text: string;
    included: string[];
    excluded: {
        itemId: string;
        reason: string;
    }[];
} {
    const included: string[] = [], excluded: {
        itemId: string;
        reason: string;
    }[] = [];
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ReturnWindow//EN', 'METHOD:PUBLISH', 'CALSCALE:GREGORIAN'];
    const text = (name: string, value: string) => lines.push(`${name}:${escapeIcsText(value)}`);
    for (const item of state.receipt?.items ?? []) {
        const outcome = result.items.find(r => r.itemId === item.id)?.outcome;
        const reason = (result.refusal ? { no_policy: 'No policy supplied', no_window_in_policy: 'No return window found', no_receipt: 'No receipt supplied' }[result.refusal.code] : null) ?? (!outcome ? 'No result' : outcome.status !== 'computed' ? ({ not_returnable: 'Not returnable', unsure: 'Clock start not confirmed', needs_answer: 'Waiting for your answer', no_policy_match: 'No policy match', unsupported: 'Business days unsupported', conflict: 'Conflicting passages', missing_input: 'Missing date' }[outcome.status]) : outcome.deadline < result.today ? 'Already passed' : null);
        if (reason || outcome?.status !== 'computed' || !state.policy) {
            excluded.push({ itemId: item.id, reason: reason ?? 'No policy' });
            continue;
        }
        included.push(item.id);
        const clause = state.policy.clauses.find(c => c.id === outcome.clauseId)!;
        const description = item.description.value ?? 'Item', store = state.receipt?.store.value ?? 'Store not provided';
        lines.push('BEGIN:VEVENT');
        text('UID', `${item.id}-${state.policy.sha256.slice(0, 12)}@returnwindow.local`);
        lines.push(`DTSTAMP:${now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`, `DTSTART;VALUE=DATE:${outcome.deadline.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${addDays(outcome.deadline, 1).replace(/-/g, '')}`);
        text('SUMMARY', `Last day to return: ${description} — ${store}`);
        text('DESCRIPTION', `${description}\n${outcome.window.amount} ${outcome.window.unit.replace(/_/g, ' ')} from ${outcome.start.basis} (${formatLong(outcome.start.date)}).\n${clause.span.text}\nPolicy: ${state.policy.label}, copied ${state.policy.capturedOn}\nSHA-256: ${state.policy.sha256}\n${DATE_CONVENTION}\nNot legal advice.`);
        // Decision 8: 09:00 SGT = 01:00 UTC on the preceding civil day.
        lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `TRIGGER;VALUE=DATE-TIME:${addDays(outcome.deadline, -1).replace(/-/g, '')}T010000Z`);
        text('DESCRIPTION', `Return ${description} tomorrow`);
        lines.push('END:VALARM', 'END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    return { text: lines.map(foldIcsLine).join('\r\n') + '\r\n', included, excluded };
}
