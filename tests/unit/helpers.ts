import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { analysePolicy } from '../../src/domain/policy-parser';
import { parseCivilDate } from '../../src/domain/civil-date';
import { documentFromText, extractedField, parseReceipt } from '../../src/domain/receipt-parser';
import { emptyCase } from '../../src/state/case-store';
import type { CaseState, CivilDate } from '../../src/domain/types';
export const civil = (s: string): CivilDate => {
    const d = parseCivilDate(s);
    if (!d)
        throw new Error(`Bad test date ${s}`);
    return d;
};
export const policyText = readFileSync(new URL('../../fixtures/policies/policy-demo.txt', import.meta.url), 'utf8');
export const receiptText = readFileSync(new URL('../../fixtures/receipts/receipt-demo.txt', import.meta.url), 'utf8');
export const now = new Date('2026-10-20T04:00:00Z');
export function policy(text = policyText) { return analysePolicy('Juniper Lane Goods returns page', text, civil('2026-10-18'), createHash('sha256').update(text.replace(/\r\n?/g, '\n')).digest('hex')); }
export function demo(): CaseState { const s = emptyCase(); s.sample = true; s.receiptOcr = documentFromText(receiptText); s.receipt = parseReceipt(s.receiptOcr); s.policy = policy(); return s; }
export function simple(text: string, purchase = '2026-10-08', description = 'Linen Shirt'): CaseState {
    const s = emptyCase();
    s.receiptOcr = documentFromText(`JUNIPER LANE GOODS\nOrder date: ${purchase}\n${description} 12.00\nTOTAL 12.00\nThank you!`);
    s.receipt = parseReceipt(s.receiptOcr);
    s.policy = policy(text);
    return s;
}
export function answered(choice: 'purchase' | 'delivery' | 'unsure', delivery?: string): CaseState {
    const s = demo();
    s.answers = [{ questionId: 'clock:c2', choice, at: '2026-10-20T04:00:00Z' }];
    if (delivery)
        s.deliveryDate = extractedField(civil(delivery));
    return s;
}
