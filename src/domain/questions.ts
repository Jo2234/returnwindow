import type { CivilDate, LineItem, PolicyClause, Question } from './types';
import { formatLong } from './civil-date';
export function questionFor(clause: PolicyClause, items: LineItem[], purchaseDate: CivilDate | null): Question {
    const delivery = clause.anchor.value === 'delivery';
    return { id: `${delivery ? 'delivery' : 'clock'}:${clause.id}`, kind: delivery ? 'delivery_date' : 'clock_start', clauseId: clause.id, itemIds: items.map(i => i.id), prompt: delivery ? 'When was your order delivered?' : `This passage says “${clause.window?.span.text ?? ''}” but not when the clock starts. Does it start on the purchase date (${purchaseDate ? formatLong(purchaseDate) : 'not provided'}) or when the order was delivered?` };
}
