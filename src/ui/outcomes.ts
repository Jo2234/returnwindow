import type { ItemOutcome } from '../domain/types';
import { formatLong } from '../domain/civil-date';
export const passageNumber = (id: string): string => ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'][Number(id.slice(1)) - 1] ?? id.slice(1);
export function outcomeText(outcome: ItemOutcome): string {
    switch (outcome.status) {
        case 'computed': return formatLong(outcome.deadline);
        case 'needs_answer': return "Waiting for your answer: the policy doesn't say when this clock starts.";
        case 'unsure': return `Not computed.${outcome.earliestPossible ? ` Earliest possible last day: ${formatLong(outcome.earliestPossible)} (if counted from purchase).` : ''} Check with the store.`;
        case 'not_returnable': return `Not returnable under passage ${passageNumber(outcome.clauseId)} (final sale).`;
        case 'no_policy_match': return "No policy line covers this item. ReturnWindow won't guess.";
        case 'unsupported': return 'This passage counts business days. ReturnWindow only counts calendar days, so no date is shown.';
        case 'conflict': return `Passages ${outcome.clauseIds.map(passageNumber).join(' and ')} give different windows. ReturnWindow won't pick one.`;
        case 'missing_input': return `Add the ${outcome.field === 'purchaseDate' ? 'purchase' : 'delivery'} date to compute this.`;
    }
}
