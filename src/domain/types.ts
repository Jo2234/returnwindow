export type CivilDate = string & {
    readonly __brand: 'CivilDate';
}; // 'YYYY-MM-DD', valid proleptic Gregorian, 1900–2199
export type Category = 'electronics' | 'apparel' | 'footwear' | 'home' | 'beauty' | 'groceries' | 'other';
export const CATEGORIES: readonly Category[] = ['electronics', 'apparel', 'footwear', 'home', 'beauty', 'groceries', 'other'];
export interface TextSpan {
    start: number;
    end: number;
    text: string;
} // invariant: source.slice(start, end) === text, start < end
export interface BBox {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
} // pixels in the source image
export interface OcrWord {
    text: string;
    confidence: number /*0–100*/;
    bbox: BBox;
}
export interface OcrLine {
    text: string;
    confidence: number;
    bbox: BBox | null;
    words: OcrWord[];
}
export interface OcrDocument {
    source: 'image' | 'pdf-text' | 'pdf-ocr' | 'pasted-text';
    engine: {
        name: 'tesseract.js';
        version: string;
        lang: 'eng';
        langDataVersion: string;
    } | null; // null for text sources
    lines: OcrLine[]; // reading order, top to bottom
    imageSize: {
        width: number;
        height: number;
    } | null;
}
export type FieldOrigin = 'extracted' | 'corrected';
export interface Field<T> {
    value: T | null;
    confidence: number; // 0–100; 100 for pasted text and corrections
    lineIndex: number | null; // index into OcrDocument.lines
    raw: string | null; // the source substring the value came from
    origin: FieldOrigin;
    needsCheck: boolean; // confidence < 70, or a parse ambiguity, or OCR character repair applied
    note: string | null; // human-readable reason when needsCheck, e.g. "Read as day/month (Singapore format)"
}
export interface LineItem {
    id: string; // 'item-1', 'item-2', … in receipt order; stable across corrections
    description: Field<string>;
    amountCents: Field<number>;
    quantity: number; // default 1
    category: {
        value: Category;
        origin: 'lexicon' | 'corrected' | 'default';
        keyword: string | null;
    };
    marker: {
        finalSale: boolean;
        keyword: string | null;
    }; // e.g. "FINAL SALE", "CLEARANCE" in the description
}
export interface ReceiptExtraction {
    store: Field<string>;
    purchaseDate: Field<CivilDate>;
    dateFormat: 'DMY' | 'YMD' | 'MONTH_NAME' | null;
    items: LineItem[];
    totalCents: Field<number>;
    warnings: ExtractionWarning[];
}
export type ExtractionWarning = {
    code: 'low_ocr_confidence';
    meanConfidence: number;
} | {
    code: 'no_date_found';
} | {
    code: 'no_items_found';
} | {
    code: 'multiple_dates_found';
    candidates: CivilDate[];
} | {
    code: 'items_total_mismatch';
    itemsCents: number;
    totalCents: number;
};
export type ClockAnchor = 'purchase' | 'delivery' | 'unspecified';
export type WindowUnit = 'days' | 'calendar_days' | 'weeks' | 'months' | 'business_days';
export interface PolicyClause {
    id: string; // 'c1', 'c2', … in text order
    span: TextSpan; // the whole clause (sentence, bullet or line)
    kind: 'window' | 'exclusion';
    window: {
        amount: number;
        unit: WindowUnit;
        span: TextSpan;
    } | null; // non-null iff kind === 'window'
    anchor: {
        value: ClockAnchor;
        span: TextSpan | null;
    }; // span null iff 'unspecified'
    scope: {
        type: 'categories';
        categories: Category[];
        spans: TextSpan[];
    } | {
        type: 'marked';
        marker: 'final_sale';
        span: TextSpan;
    } // "items marked FINAL SALE"
     | {
        type: 'default';
        span: TextSpan | null;
    }; // "all other items" / no scope words
}
export interface PolicyDoc {
    label: string; // user-supplied, 1–120 chars
    text: string; // exactly as supplied after CRLF→LF normalisation (no other change)
    sha256: string; // hex of UTF-8 text (Web Crypto in browser, node:crypto in tests)
    capturedOn: CivilDate; // the date the user says they copied it (default: today SGT)
    clauses: PolicyClause[];
}
export interface Answer {
    questionId: string;
    choice: 'purchase' | 'delivery' | 'unsure';
    at: string; /*ISO instant*/
}
export interface CaseState {
    schemaVersion: 1;
    sample: boolean; // true when loaded via "Try the sample" (labelled "Synthetic sample")
    receiptOcr: OcrDocument | null;
    receipt: ReceiptExtraction | null;
    deliveryDate: Field<CivilDate>; // usually null until a question answer supplies it
    policy: PolicyDoc | null;
    answers: Answer[];
    corrections: Correction[];
}
export interface Correction {
    id: string; // 'k1', 'k2', … sequential
    at: string; // ISO instant (injected clock)
    target: {
        field: 'store';
    } | {
        field: 'purchaseDate';
    } | {
        field: 'deliveryDate';
    } | {
        field: 'item.description';
        itemId: string;
    } | {
        field: 'item.amountCents';
        itemId: string;
    } | {
        field: 'item.category';
        itemId: string;
    } | {
        field: 'answer';
        questionId: string;
    };
    from: string | null; // display string of previous value
    to: string;
}
export type ItemOutcome = {
    status: 'computed';
    deadline: CivilDate;
    start: {
        date: CivilDate;
        basis: 'purchase' | 'delivery';
        via: 'policy' | 'answer';
    };
    window: {
        amount: number;
        unit: Exclude<WindowUnit, 'business_days'>;
    };
    clauseId: string;
} | {
    status: 'needs_answer';
    questionId: string;
    clauseId: string;
    earliestPossible: CivilDate | null;
} // earliest = purchase-anchored deadline if purchase date known
 | {
    status: 'unsure';
    clauseId: string;
    earliestPossible: CivilDate | null;
} // user answered "Not sure"
 | {
    status: 'not_returnable';
    clauseId: string;
} | {
    status: 'no_policy_match';
} | {
    status: 'unsupported';
    clauseId: string;
    reason: 'business_days';
} | {
    status: 'conflict';
    clauseIds: [
        string,
        string,
        ...string[]
    ];
} | {
    status: 'missing_input';
    field: 'purchaseDate' | 'deliveryDate';
    clauseId: string;
};
export interface ItemResult {
    itemId: string;
    outcome: ItemOutcome;
    daysLeft: number | null;
    urgency: 'open' | 'closing_soon' | 'last_day' | 'closed' | null;
}
export interface Question {
    id: string; // `clock:${clauseId}` or `delivery:${clauseId}`
    kind: 'clock_start' | 'delivery_date';
    clauseId: string;
    itemIds: string[]; // all items governed by that clause
    prompt: string; // see §5.5 for exact wording
}
export type CaseRefusal = {
    code: 'no_policy';
} | {
    code: 'no_window_in_policy';
} | {
    code: 'no_receipt';
};
export interface CaseResult {
    refusal: CaseRefusal | null; // non-null → items[] all have no deadline and export is disabled
    items: ItemResult[];
    questions: Question[]; // ordered by first governed item; the UI shows questions[0] only
    today: CivilDate;
}
