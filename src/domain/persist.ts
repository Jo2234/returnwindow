import { z } from 'zod';
import type { CaseState, CivilDate } from './types';
import { CATEGORIES } from './types';
import { parseCivilDate } from './civil-date';
import { policySpansValid } from './policy-parser';
export const CASE_STORAGE_KEY = 'returnwindow.v1.case';
const civil = z.string().refine(s => parseCivilDate(s) !== null).transform(s => s as CivilDate);
const confidence = z.number().min(0).max(100);
const index = z.number().int().nonnegative();
const span = z.strictObject({ start: index, end: index, text: z.string() });
const bbox = z.strictObject({ x0: z.number().nonnegative(), y0: z.number().nonnegative(), x1: z.number().nonnegative(), y1: z.number().nonnegative() }).refine(b => b.x1 >= b.x0 && b.y1 >= b.y0);
const field = <T extends z.ZodType>(value: T) => z.strictObject({ value: value.nullable(), confidence, lineIndex: index.nullable(), raw: z.string().nullable(), origin: z.enum(['extracted', 'corrected']), needsCheck: z.boolean(), note: z.string().nullable() });
const money = z.number().int().nonnegative();
const target = z.union([
    z.strictObject({ field: z.enum(['store', 'purchaseDate', 'deliveryDate']) }),
    z.strictObject({ field: z.enum(['item.description', 'item.amountCents', 'item.category']), itemId: z.string() }),
    z.strictObject({ field: z.literal('answer'), questionId: z.string() }),
]);
export const caseSchema = z.strictObject({
    schemaVersion: z.literal(1), sample: z.boolean(),
    receiptOcr: z.strictObject({ source: z.enum(['image', 'pdf-text', 'pdf-ocr', 'pasted-text']), engine: z.strictObject({ name: z.literal('tesseract.js'), version: z.string(), lang: z.literal('eng'), langDataVersion: z.string() }).nullable(), lines: z.array(z.strictObject({ text: z.string(), confidence, bbox: bbox.nullable(), words: z.array(z.strictObject({ text: z.string(), confidence, bbox })) })), imageSize: z.strictObject({ width: z.number().int().positive(), height: z.number().int().positive() }).nullable() }).nullable(),
    receipt: z.strictObject({ store: field(z.string()), purchaseDate: field(civil), dateFormat: z.enum(['DMY', 'YMD', 'MONTH_NAME']).nullable(), items: z.array(z.strictObject({ id: z.string().min(1), description: field(z.string()), amountCents: field(money), quantity: z.number().int().positive(), category: z.strictObject({ value: z.enum(CATEGORIES), origin: z.enum(['lexicon', 'corrected', 'default']), keyword: z.string().nullable() }), marker: z.strictObject({ finalSale: z.boolean(), keyword: z.string().nullable() }) })), totalCents: field(money), warnings: z.array(z.union([z.strictObject({ code: z.literal('low_ocr_confidence'), meanConfidence: confidence }), z.strictObject({ code: z.enum(['no_date_found', 'no_items_found']) }), z.strictObject({ code: z.literal('multiple_dates_found'), candidates: z.array(civil) }), z.strictObject({ code: z.literal('items_total_mismatch'), itemsCents: money, totalCents: money })])) }).nullable(),
    deliveryDate: field(civil),
    policy: z.strictObject({ label: z.string().min(1).max(120), text: z.string().max(50000), sha256: z.string().regex(/^[a-f0-9]{64}$/), capturedOn: civil, clauses: z.array(z.strictObject({ id: z.string(), span, kind: z.enum(['window', 'exclusion']), window: z.strictObject({ amount: z.number().int().nonnegative(), unit: z.enum(['days', 'calendar_days', 'weeks', 'months', 'business_days']), span }).nullable(), anchor: z.strictObject({ value: z.enum(['purchase', 'delivery', 'unspecified']), span: span.nullable() }), scope: z.union([z.strictObject({ type: z.literal('categories'), categories: z.array(z.enum(CATEGORIES)), spans: z.array(span) }), z.strictObject({ type: z.literal('marked'), marker: z.literal('final_sale'), span }), z.strictObject({ type: z.literal('default'), span: span.nullable() })]) })) }).nullable(),
    answers: z.array(z.strictObject({ questionId: z.string(), choice: z.enum(['purchase', 'delivery', 'unsure']), at: z.iso.datetime({ offset: true }) })),
    corrections: z.array(z.strictObject({ id: z.string(), at: z.iso.datetime({ offset: true }), target, from: z.string().nullable(), to: z.string() })),
}).superRefine((state, ctx) => {
    const ids = state.receipt?.items.map(i => i.id) ?? [];
    if (new Set(ids).size !== ids.length)
        ctx.addIssue({ code: 'custom', message: 'Duplicate item ids' });
    if (state.deliveryDate.value && state.receipt?.purchaseDate.value && state.deliveryDate.value < state.receipt.purchaseDate.value)
        ctx.addIssue({ code: 'custom', message: 'Delivery before purchase' });
    if (state.policy && (!policySpansValid(state.policy) || state.policy.clauses.some(c => (c.kind === 'window') !== (c.window !== null))))
        ctx.addIssue({ code: 'custom', message: 'Invalid policy evidence' });
});
export function clearCase(storage: Storage): void { try {
    storage.removeItem(CASE_STORAGE_KEY);
}
catch { /* Storage may be blocked; the memory case still clears. */ } }
export function saveCase(state: CaseState, storage: Storage): void { try {
    storage.setItem(CASE_STORAGE_KEY, JSON.stringify(state));
}
catch { /* Keep the in-memory case usable if storage is unavailable. */ } }
export function loadCase(storage: Storage): CaseState | null {
    try {
        const raw = storage.getItem(CASE_STORAGE_KEY);
        if (raw === null)
            return null;
        const parsed = caseSchema.safeParse(JSON.parse(raw));
        if (parsed.success)
            return parsed.data;
    }
    catch { /* Invalid JSON or inaccessible storage. */ }
    clearCase(storage);
    return null;
}
