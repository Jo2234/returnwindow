import type { CaseResult, CaseState, CivilDate, ItemOutcome, PolicyClause, Question } from './types';
import { addDays, addMonthsClamped, diffDays, todayInSingapore } from './civil-date';
import { governingClauses } from './matcher';
import { questionFor } from './questions';
import { policySpansValid } from './policy-parser';
export const DATE_CONVENTION = "Dates are calendar dates in Singapore time (Asia/Singapore). The day of purchase or delivery counts as day 0. A 30-day window ends at the end of day 30. 'Days' with no qualifier are treated as calendar days. A one-month window ends on the same date next month, or on the month's last day if that date doesn't exist.";
function endDate(start: CivilDate, clause: PolicyClause): CivilDate {
    const w = clause.window!;
    return w.unit === 'months' ? addMonthsClamped(start, w.amount) : addDays(start, w.amount * (w.unit === 'weeks' ? 7 : 1));
}
export function computeCase(state: CaseState, now: Date): CaseResult {
    const today = todayInSingapore(now), { receipt, policy } = state;
    const refusal = !policy ? { code: 'no_policy' as const } : !policy.clauses.some(c => c.kind === 'window') ? { code: 'no_window_in_policy' as const } : !receipt ? { code: 'no_receipt' as const } : null;
    const questions: Question[] = [];
    // Valid CaseState guarantees P1. Refuse invalid evidence rather than calculate a date from it.
    const validEvidence = policy ? policySpansValid(policy) : true;
    function ask(c: PolicyClause, itemId: string): string {
        const q = questionFor(c, [], receipt?.purchaseDate.value ?? null), existing = questions.find(x => x.id === q.id);
        if (existing)
            existing.itemIds.push(itemId);
        else
            questions.push({ ...q, itemIds: [itemId] });
        return q.id;
    }
    const items = (receipt?.items ?? []).map(item => {
        let outcome: ItemOutcome = { status: 'no_policy_match' };
        if (!refusal && policy && validEvidence) {
            const match = governingClauses(item, policy), clause = match.clauses[0];
            if (match.kind === 'conflict')
                outcome = { status: 'conflict', clauseIds: match.clauses.map(c => c.id) as [
                        string,
                        string,
                        ...string[]
                    ] };
            else if (clause) {
                const clauseId = clause.id, w = clause.window;
                if (match.kind === 'exclusion')
                    outcome = { status: 'not_returnable', clauseId };
                else if (w?.unit === 'business_days')
                    outcome = { status: 'unsupported', clauseId, reason: 'business_days' };
                else if (w) {
                    const answer = state.answers.find(a => a.questionId === `clock:${clauseId}`);
                    const earliestPossible = receipt?.purchaseDate.value ? endDate(receipt.purchaseDate.value, clause) : null;
                    const anchor = clause.anchor.value === 'unspecified' ? answer?.choice : clause.anchor.value;
                    if (!anchor)
                        outcome = { status: 'needs_answer', questionId: ask(clause, item.id), clauseId, earliestPossible };
                    else if (anchor === 'unsure')
                        outcome = { status: 'unsure', clauseId, earliestPossible };
                    else {
                        const start = anchor === 'purchase' ? receipt?.purchaseDate.value : state.deliveryDate.value;
                        if (!start) {
                            outcome = { status: 'missing_input', field: anchor === 'purchase' ? 'purchaseDate' : 'deliveryDate', clauseId };
                            if (anchor === 'delivery')
                                ask(clause, item.id);
                        }
                        else
                            outcome = { status: 'computed', deadline: endDate(start, clause), start: { date: start, basis: anchor, via: clause.anchor.value === 'unspecified' ? 'answer' : 'policy' }, window: { amount: w.amount, unit: w.unit }, clauseId };
                    }
                }
            }
        }
        const daysLeft = outcome.status === 'computed' ? diffDays(today, outcome.deadline) : null;
        const urgency = daysLeft === null ? null : daysLeft < 0 ? 'closed' : daysLeft === 0 ? 'last_day' : daysLeft <= 3 ? 'closing_soon' : 'open';
        return { itemId: item.id, outcome, daysLeft, urgency } as CaseResult['items'][number];
    });
    return { refusal, items, questions, today };
}
