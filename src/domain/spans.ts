import type { TextSpan } from './types';
export function verifySpan(source: string, s: TextSpan): boolean {
    return Number.isInteger(s.start) && Number.isInteger(s.end) && s.start >= 0 && s.end <= source.length && s.start < s.end && source.slice(s.start, s.end) === s.text;
}
export function makeSpan(source: string, start: number, end: number): TextSpan {
    const span = { start, end, text: source.slice(start, end) };
    if (!verifySpan(source, span))
        throw new RangeError('Invalid evidence span');
    return span;
}
