import { useReducer } from 'react';
import type { CaseResult, CaseState, CivilDate } from '../domain/types';
import { extractedField } from '../domain/receipt-parser';
import { computeCase } from '../domain/engine';
export function emptyCase(): CaseState {
    return { schemaVersion: 1, sample: false, receiptOcr: null, receipt: null, deliveryDate: extractedField<CivilDate>(null), policy: null, answers: [], corrections: [] };
}
export interface StoreState {
    case: CaseState;
    result: CaseResult;
    previousResult: CaseResult | null;
    revision: number;
}
export type StoreAction = {
    type: 'replace';
    state: CaseState;
    now: Date;
} | {
    type: 'reset';
    now: Date;
};
export function caseReducer(store: StoreState, action: StoreAction): StoreState {
    const state = action.type === 'reset' ? emptyCase() : action.state;
    return { case: state, result: computeCase(state, action.now), previousResult: action.type === 'reset' ? null : store.result, revision: store.revision + 1 };
}
export function useCaseStore(now: Date) {
    return useReducer(caseReducer, now, now => { const state = emptyCase(); return { case: state, result: computeCase(state, now), previousResult: null, revision: 0 }; });
}
