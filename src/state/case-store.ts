import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { CaseResult, CaseState, CivilDate } from '../domain/types';
import { extractedField } from '../domain/receipt-parser';
import { computeCase } from '../domain/engine';
import { CASE_STORAGE_KEY, clearCase, loadCase, saveCase } from '../domain/persist';
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
    const [store, send] = useReducer(caseReducer, now, now => { const state = emptyCase(); return { case: state, result: computeCase(state, now), previousResult: null, revision: 0 }; });
    const [ready, setReady] = useState(false), [restored, setRestored] = useState(false), [storageWarning, setStorageWarning] = useState<string | null>(null);
    const initialized = useRef(false), timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        // Run once even under StrictMode's effect replay. Invalid state is cleared by loadCase.
        if (initialized.current)
            return;
        initialized.current = true;
        try {
            const existed = localStorage.getItem(CASE_STORAGE_KEY) !== null, saved = loadCase(localStorage);
            if (saved) {
                send({ type: 'replace', state: saved, now });
                setRestored(true);
            }
            else if (existed)
                setStorageWarning("Saved case couldn't be read and was cleared.");
        }
        catch {
            setStorageWarning('Local saving is unavailable; this case is kept in memory only.');
        }
        setReady(true);
    }, []);
    const dispatch = useCallback((action: StoreAction) => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        if (action.type === 'reset') {
            try {
                clearCase(localStorage);
            }
            catch { /* Memory reset still works. */ }
            setRestored(false);
        }
        send(action);
    }, []);
    useEffect(() => {
        if (!ready)
            return;
        if (!store.case.receipt && !store.case.policy) {
            try {
                clearCase(localStorage);
            }
            catch { /* Storage blocked. */ }
            return;
        }
        timer.current = setTimeout(() => { try {
            saveCase(store.case, localStorage);
        }
        catch { /* Storage blocked. */ } timer.current = null; }, 300);
        return () => { if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        } };
    }, [store.case, ready]);
    return [store, dispatch, { restored, storageWarning }] as const;
}
