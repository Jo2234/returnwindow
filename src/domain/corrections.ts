import type { Answer, CaseState, Category, CivilDate, Correction, Field } from './types';
import { CATEGORIES } from './types';
import { formatLong, parseCivilDate } from './civil-date';
import { parseDateToken } from './receipt-parser';
import { categorize, saleMarker } from './categories';
export type CorrectionError = {
    code: 'invalid_date';
} | {
    code: 'delivery_before_purchase';
} | {
    code: 'empty_value';
} | {
    code: 'invalid_amount';
} | {
    code: 'unknown_item';
};
export function displayDate(date: CivilDate | null): string | null {
    return date ? formatLong(date).slice(4).replace(/^\d\s/, s => '0' + s) : null;
}
function corrected<T>(field: Field<T>, value: T): Field<T> {
    return { ...field, value, origin: 'corrected', confidence: 100, needsCheck: false, note: null };
}
export function applyCorrection(state: CaseState, c: Omit<Correction, 'id' | 'from'>, value: unknown): {
    state: CaseState;
} | {
    error: CorrectionError;
} {
    const field = c.target.field;
    const failure = (code: CorrectionError['code']) => ({ error: { code } });
    // Validate before cloning or writing; caller's original state is never mutated.
    if (field === 'purchaseDate' || field === 'deliveryDate') {
        const date = typeof value === 'string' ? (parseCivilDate(value) ?? parseDateToken(value)?.date) : null;
        if (!date)
            return failure('invalid_date');
        const purchase = field === 'purchaseDate' ? date : state.receipt?.purchaseDate.value;
        const delivery = field === 'deliveryDate' ? date : state.deliveryDate.value;
        if (purchase && delivery && delivery < purchase)
            return failure('delivery_before_purchase');
        if (field === 'purchaseDate' && !state.receipt)
            return failure('empty_value');
        const next = structuredClone(state), previous = field === 'purchaseDate' ? next.receipt!.purchaseDate : next.deliveryDate;
        if (field === 'purchaseDate')
            next.receipt!.purchaseDate = corrected(previous, date);
        else
            next.deliveryDate = corrected(previous, date);
        next.corrections.push({ ...c, id: `k${next.corrections.length + 1}`, from: displayDate(previous.value) });
        return { state: next };
    }
    if (field === 'answer') {
        if (typeof value !== 'string' || !['purchase', 'delivery', 'unsure'].includes(value))
            return failure('empty_value');
        const target = c.target as Extract<Correction['target'], {
            field: 'answer';
        }>;
        const clause = state.policy?.clauses.find(x => `clock:${x.id}` === target.questionId || `delivery:${x.id}` === target.questionId);
        if (!clause)
            return failure('empty_value');
        const next = structuredClone(state), old = next.answers.find(a => a.questionId === target.questionId);
        const answer: Answer = { questionId: target.questionId, choice: value as Answer['choice'], at: c.at };
        next.answers = next.answers.filter(a => a.questionId !== target.questionId);
        next.answers.push(answer);
        next.corrections.push({ ...c, id: `k${next.corrections.length + 1}`, from: old?.choice ?? null });
        return { state: next };
    }
    if (!state.receipt)
        return failure('empty_value');
    const next = structuredClone(state);
    let previous: string | null = null;
    if (field === 'store') {
        if (typeof value !== 'string' || !value.trim())
            return failure('empty_value');
        previous = next.receipt!.store.value;
        next.receipt!.store = corrected(next.receipt!.store, value.trim());
    }
    else {
        const target = c.target as Extract<Correction['target'], {
            itemId: string;
        }>;
        const item = next.receipt!.items.find(i => i.id === target.itemId);
        if (!item)
            return failure('unknown_item');
        if (field === 'item.description') {
            if (typeof value !== 'string' || !value.trim())
                return failure('empty_value');
            previous = item.description.value;
            item.description = corrected(item.description, value.trim());
            item.marker = saleMarker(value);
            if (item.category.origin !== 'corrected') {
                const category = categorize(value);
                item.category = { ...category, origin: category.keyword ? 'lexicon' : 'default' };
            }
        }
        else if (field === 'item.amountCents') {
            if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0)
                return failure('invalid_amount');
            previous = item.amountCents.value === null ? null : (item.amountCents.value / 100).toFixed(2);
            item.amountCents = corrected(item.amountCents, value);
        }
        else {
            if (typeof value !== 'string' || !CATEGORIES.includes(value as Category))
                return failure('empty_value');
            previous = item.category.value;
            item.category = { value: value as Category, origin: 'corrected', keyword: null };
        }
    }
    next.corrections.push({ ...c, id: `k${next.corrections.length + 1}`, from: previous });
    return { state: next };
}
