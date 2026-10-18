import type { CivilDate, Field, OcrDocument, ReceiptExtraction } from './types';
import { parseCivilDate } from './civil-date';
import { categorize, saleMarker } from './categories';
// Temporary adapter; Stage S2 moves this export into extract/input.ts.
export function documentFromText(text: string): OcrDocument {
    return { source: 'pasted-text', engine: null, imageSize: null, lines: text.replace(/\r\n?/g, '\n').split('\n').map(text => ({ text, confidence: 100, bbox: null, words: [] })) };
}
export function extractedField<T>(value: T | null, confidence = 100, lineIndex: number | null = null, raw: string | null = null): Field<T> {
    return { value, confidence, lineIndex, raw, origin: 'extracted', needsCheck: confidence < 70, note: confidence < 70 ? 'Low reading confidence' : null };
}
const repair = (s: string) => s.replace(/[OoIlS]/g, c => ({ O: '0', o: '0', I: '1', l: '1', S: '5' })[c]!);
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
export function parseDateToken(raw: string): {
    date: CivilDate;
    format: 'DMY' | 'YMD' | 'MONTH_NAME';
    ambiguous: boolean;
} | null {
    const token = raw.trim();
    let y: number, m: number, d: number, format: 'DMY' | 'YMD' | 'MONTH_NAME', ambiguous = false;
    if (/^[\dOoIlS]{4}-[\dOoIlS]{2}-[\dOoIlS]{2}$/.test(token)) {
        const p = repair(token).split('-').map(Number);
        [y, m, d] = p as [
            number,
            number,
            number
        ];
        format = 'YMD';
    }
    else if (/^[\dOoIlS]{1,2}([/.-])[\dOoIlS]{1,2}\1(?:[\dOoIlS]{4}|[\dOoIlS]{2})$/.test(token)) {
        const p = repair(token).split(/[/.-]/).map(Number);
        [d, m, y] = p as [
            number,
            number,
            number
        ];
        if (y < 100)
            y += 2000;
        format = 'DMY';
        ambiguous = d <= 12 && m <= 12 && d !== m;
    }
    else {
        const a = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(token), b = /^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/.exec(token);
        if (!a && !b)
            return null;
        d = Number(a?.[1] ?? b![2]);
        const month = (a?.[2] ?? b![1]!).toLowerCase();
        m = months.findIndex(name => name === month || name.slice(0, 3) === month) + 1;
        y = Number(a?.[3] ?? b![3]);
        format = 'MONTH_NAME';
    }
    const date = parseCivilDate(`${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    return date ? { date, format, ambiguous } : null;
}
export function parseAmount(raw: string): {
    cents: number;
    repaired: boolean;
} | null {
    const s = raw.trim().replace(/^(?:S?\$)\s*/, ''), fixed = repair(s);
    if (!/^\d{1,5}[.,]\d{2}$/.test(fixed))
        return null;
    const [whole, decimal] = fixed.split(/[.,]/);
    return { cents: Number(whole) * 100 + Number(decimal), repaired: fixed !== s };
}
const datePattern = /\b[\dOoIlS]{4}-[\dOoIlS]{2}-[\dOoIlS]{2}\b|\b[\dOoIlS]{1,2}[/.-][\dOoIlS]{1,2}[/.-](?:[\dOoIlS]{4}|[\dOoIlS]{2})\b|\b\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\b|\b[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}\b/g;
export function parseReceipt(doc: OcrDocument): ReceiptExtraction {
    const out: ReceiptExtraction = { store: extractedField<string>(null), purchaseDate: extractedField<CivilDate>(null), dateFormat: null, items: [], totalCents: extractedField<number>(null), warnings: [] };
    const candidates: {
        parsed: NonNullable<ReturnType<typeof parseDateToken>>;
        index: number;
        raw: string;
        priority: number;
    }[] = [];
    doc.lines.forEach((line, index) => {
        if (index < Math.ceil(doc.lines.length / 4) && out.store.value === null && (line.text.match(/[a-z]/gi)?.length ?? 0) >= 3 && !/\b(?:road|rd|street|st|avenue|ave|receipt|invoice|order)\b|#\d|singapore\s+\d{6}|https?:|www\.|\d{7,}/i.test(line.text) && ![...line.text.matchAll(datePattern)].length)
            out.store = extractedField(line.text.trim(), line.confidence, index, line.text);
        for (const match of line.text.matchAll(datePattern)) {
            const parsed = parseDateToken(match[0]);
            if (parsed)
                candidates.push({ parsed, index, raw: match[0], priority: /\b(?:date|purchased|txn|transaction)\b/i.test(line.text) ? 0 : 1 });
        }
        const amountMatch = /(?:S?\$)?\s*([\dOoIlS]{1,5}[.,][\dOoIlS]{2})\s*$/.exec(line.text);
        if (!amountMatch)
            return;
        const amount = parseAmount(amountMatch[0]);
        if (!amount)
            return;
        const confidence = line.words.length ? line.words.reduce((n, w) => n + w.confidence, 0) / line.words.length : line.confidence;
        const field = extractedField(amount.cents, confidence, index, amountMatch[0].trim());
        if (amount.repaired) {
            field.needsCheck = true;
            field.note = 'Some characters were guessed';
        }
        if (/^\s*total\b/i.test(line.text))
            out.totalCents = field;
        if (/\b(?:subtotal|sub-total|total|gst|tax|vat|change|cash|visa|mastercard|nets|paynow|amex|rounding|discount|balance|tendered|payment)\b/i.test(line.text))
            return;
        let description = line.text.slice(0, amountMatch.index).trim(), quantity = 1;
        const qty = /^(\d{1,2})\s*[x×@]\s+/.exec(description);
        if (qty) {
            quantity = Number(qty[1]);
            description = description.slice(qty[0].length);
        }
        description = description.replace(/^[A-Z0-9-]{6,}\s+/, '').trim();
        if (!description)
            return;
        const category = categorize(description);
        out.items.push({ id: `item-${out.items.length + 1}`, description: extractedField(description, confidence, index, description), amountCents: field, quantity, category: { ...category, origin: category.keyword ? 'lexicon' : 'default' }, marker: saleMarker(description) });
    });
    candidates.sort((a, b) => a.priority - b.priority || a.index - b.index);
    const chosen = candidates[0], distinct = [...new Set(candidates.map(c => c.parsed.date))];
    if (chosen) {
        const f = extractedField(chosen.parsed.date, doc.lines[chosen.index]!.confidence, chosen.index, chosen.raw);
        if (chosen.parsed.ambiguous) {
            f.needsCheck = true;
            f.note = 'Read as day/month (Singapore format)';
        }
        if (/[OoIlS]/.test(chosen.raw) && chosen.parsed.format !== 'MONTH_NAME') {
            f.needsCheck = true;
            f.note = 'Some characters were guessed';
        }
        if (distinct.length > 1) {
            f.needsCheck = true;
            f.note ??= 'Several dates found; check the purchase date';
            out.warnings.push({ code: 'multiple_dates_found', candidates: distinct });
        }
        out.purchaseDate = f;
        out.dateFormat = chosen.parsed.format;
    }
    else
        out.warnings.push({ code: 'no_date_found' });
    if (!out.items.length)
        out.warnings.push({ code: 'no_items_found' });
    const mean = doc.lines.length ? doc.lines.reduce((n, l) => n + l.confidence, 0) / doc.lines.length : 0;
    if (mean < 70)
        out.warnings.push({ code: 'low_ocr_confidence', meanConfidence: mean });
    const sum = out.items.reduce((n, i) => n + (i.amountCents.value ?? 0), 0);
    if (out.totalCents.value !== null && Math.abs(sum - out.totalCents.value) > 1)
        out.warnings.push({ code: 'items_total_mismatch', itemsCents: sum, totalCents: out.totalCents.value });
    return out;
}
