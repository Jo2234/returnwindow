---
doc: spec
status: approved
---

# ReturnWindow — Technical Spec

## How This Works, In Plain Language
The browser reads a receipt photo into text, or takes text straight from a PDF or paste. Small rules extract the shop, purchase date and items, then find return windows in the policy you supplied. Each item gets its own clock and exact supporting sentence. A missing clock start asks one question; unsupported or absent evidence produces an explanation instead of a guessed date.

You can correct what was read. The app recalculates from the same case and records the change, then turns confirmed dates into a calendar file and the supporting material into a printable page. There is no account or remote service. The simple core can be tested against dates calculated independently of it.

## The Core Journey Through the System
Implements prd.md > The Core Journey.

1. Receipt file/text → input router → local OCR, PDF text reader or text adapter → common text lines with confidence.
2. Receipt parser → editable receipt fields and stable item IDs. Policy text → newline normalization, SHA-256 fingerprint and clause parser → verified quotations with offsets.
3. Case store → matcher → date engine → cards, highlighted passages and one visible question.
4. Correction/answer → validated immutable case update and log → recompute and compare previous results.
5. Computed unexpired results → .ics; complete case/results → self-contained evidence HTML and print view. P1 persistence restores only the imageless case.

## Stack
The following exact pins are the lead's accepted recommendation (brief §C, plan §12), with no caret ranges. Public npm metadata resolved all 17 selected package versions during Stage 0; local installation and compatibility are not yet verified. Documentation was checked during planning.

| Dependency | Pin | Purpose and accepted tradeoff | Documentation |
|---|---|---|---|
| react, react-dom | 19.3.1 | Interactive screens without a server | [React](https://react.dev/learn) |
| @types/react, @types/react-dom | 19.3.0 | Type definitions matching UI code | [React TypeScript](https://react.dev/learn/typescript) |
| vite / @vitejs/plugin-react | 7.3.7 / 5.2.0 | Local dev server and static build; no deployment dependency | [Vite](https://vite.dev/guide/) |
| typescript | 6.0.3 | Checked contracts for the pure core | [TypeScript](https://www.typescriptlang.org/docs/) |
| vitest / fast-check | 4.1.12 / 4.10.2 | Unit and randomized invariant checks | [Vitest](https://vitest.dev/guide/), [fast-check](https://fast-check.dev/docs/introduction/) |
| jsdom | 30.1.3 | Test evidence HTML without shipping a DOM emulator | [jsdom](https://github.com/jsdom/jsdom) |
| zod | 4.6.7 | Validate saved cases before reuse | [Zod](https://zod.dev/) |
| tesseract.js | 7.0.0 | Real on-device English OCR; accuracy needs measurement | [Tesseract.js](https://github.com/naptha/tesseract.js#tesseractjs) |
| @tesseract.js-data/eng | 1.0.0 | Self-host English model; asset size stays outside Git | [tessdata](https://github.com/naptha/tessdata), [package metadata](https://registry.npmjs.org/@tesseract.js-data%2feng/1.0.0) |
| pdfjs-dist | 6.4.299 | PDF text layer, optional page-one rendering | [PDF.js](https://mozilla.github.io/pdf.js/) |
| ical.js | 2.2.1 | Independent .ics parser in tests only | [ical.js](https://kewisch.github.io/ical.js/api/) |
| @playwright/test | 1.64.1 | Browser checks and synthetic fixture rendering; one worker | [Playwright](https://playwright.dev/docs/intro) |
| @types/node | 24.19.2 | Types for Node build/test scripts | [Node.js](https://nodejs.org/api/) |

Environment: macOS 15.7 Intel, 8 GB shared RAM, Node 24.22, pnpm 12.11 ([pnpm docs](https://pnpm.io/installation)); cached Playwright Chromium 1248. No Docker, Homebrew or Python product code. Package licence/asset attribution is recorded during the build.

## Where It Runs and How Someone Tries It
Implements prd.md > The Core Journey; Screens and Layout. Planned commands after implementation:

```sh
pnpm install --frozen-lockfile
pnpm dev
# open http://127.0.0.1:5188
pnpm build
pnpm preview
# open http://127.0.0.1:4188/?today=2026-10-20
```

Both ports are strict, bound to 127.0.0.1. The first scaffold creates the lockfile before frozen installs. Postinstall copies OCR assets from installed packages; it must not fetch a CDN. Production preview is used for verification and the local demo recording. The today parameter simulates noon SGT and always shows a “Simulated today” badge. No API keys or backend are needed. A 1–3 minute video and public repository are later Johan release gates; deployment is optional and not planned. Stage 0 runs none of these app commands.

## Look and Feel
Implements prd.md > Look and Feel; scope.md > Inspiration & Identity.

Plain CSS: paper #F6F3EA, white cards, #E3DED0 borders, ink #1E2330, muted #5A6072, ink-blue #2647D0. Cards have 10 px corners. Use system UI fonts and ui-monospace/SFMono-Regular/Menlo for receipts, dates and quotations. Status colors from plan §6 always pair with words; passages also use numbered badges. Three desktop columns (30/40/30), 1280×800 demo; P1 stacks below 720 px. Visible 2 px focus, keyboard controls, WCAG AA contrast, polite result announcements, reduced-motion support and restrained 200 ms transitions. No external fonts/icons.

## Components
The exact TypeScript contracts live in docs/opus/implementation-plan.md §4; implement those names and signatures, with pure domain functions and injected time. Each component below has a PRD behavior address.

### Civil Dates — civil-date.ts
Implements prd.md > Per-Item Deadlines and Evidence. Strict valid YYYY-MM-DD civil dates (1900–2199), integer day conversion, addDays, addMonthsClamped, diffDays, formatLong and todayInSingapore. No local-time Date arithmetic. Day 0 is the purchase/delivery date; weeks multiply by seven, months clamp. Show the PRD's convention verbatim. Urgency: negative days left = closed, zero = last day, 1–3 = closing soon, ≥4 = open.

### Verified Spans — spans.ts
Implements prd.md > Per-Item Deadlines and Evidence. makeSpan/verifySpan enforce source.slice(start,end) === text, nonempty and in bounds. Window, scope and anchor spans must lie inside their clause span. Hide invalid highlights with “Evidence mismatch; highlight hidden.”

### Categories — categories.ts
Implements prd.md > Receipt and Policy Input. Fixed lexicon for electronics, footwear, apparel, beauty, home, groceries; priority in that order, whole-word matches; otherwise other. Track lexicon/corrected/default origin and final-sale markers. Use plan §5.2's lexicon rather than an inferred model label.

### Receipt Parser — receipt-parser.ts
Implements prd.md > Receipt and Policy Input. parseReceipt consumes common OCR/text lines, producing confidence-bearing fields, warnings, stable item-1… IDs, quantities and integer cents. parseDateToken accepts the plan's DMY/YMD/month-name formats, flags ambiguous numeric dates and repaired characters; never silently assumes US month/day. Exclude totals/payment lines from items. Detailed grammar and hand-written expectations: plan §§5.6, 10.4.

### Policy Parser — policy-parser.ts
Implements prd.md > Per-Item Deadlines and Evidence. analysePolicy normalizes only CRLF/CR to LF, segments clauses and detects return windows, anchors, category/default scopes and exclusions while preserving exact offsets. Use plan §5.2's grammar, including word/digit agreement. Do not misread refund-processing durations (“of approval”, “of processing”, “to process”) as return clocks. No web fetching or invented text.

### Clause Matcher — matcher.ts
Implements prd.md > Per-Item Deadlines and Evidence; States and Boundaries. governingClauses prioritizes marked final-sale exclusion, category exclusion, category window, then default window. Identical competing windows use the first; differing windows produce conflict. No match means no supported date.

### Outcome Engine — engine.ts
Implements prd.md > Per-Item Deadlines and Evidence; Observable Acceptance Criteria. computeCase(state, now) is total and deterministic on valid state. Only computed outcomes contain a deadline. No policy, no window, or no receipt refuses the case and disables export. Business days remain unsupported. Missing dates, exclusions, conflicts and absent coverage never become computed deadlines. Every referenced clause must exist. Follow plan §5.5 and the PRD's hand-computed dates.

### Questions — questions.ts
Implements prd.md > One Question and Corrections. questionFor groups all items governed by a clause. Unspecified anchors use clock:cN and purchase/delivery/unsure choices; missing explicit delivery uses delivery:cN. Deduplicate and show only questions[0], with a counter if needed. Delivery entry stays inside the same card. Unsure offers only a labelled earliest possible purchase-based date, never a computed deadline.

### Corrections — corrections.ts
Implements prd.md > One Question and Corrections. applyCorrection returns a new case or a typed error, never mutating on failure. Corrected fields have confidence 100 and no check flag; append sequential kN entries with injected timestamps and from/to. Answer changes replace that question's answer. Reject invalid dates, empty values, invalid amounts, unknown items and delivery before purchase, including edits to purchase after delivery. Reverting a correction restores the original derived results.

### Calendar Export — ics.ts
Implements prd.md > Reminders and Evidence Pack. buildIcs emits one all-day event for each computed unexpired item and reasons for exclusions. Use VALUE=DATE with exclusive next-day DTEND, stable itemId-policyHash UID, exact policy text/date convention in DESCRIPTION, CRLF, TEXT escaping and UTF-8 folding at 75 octets. SUMMARY uses the stored store field verbatim (sample JUNIPER LANE GOODS). Per approved decisions 8–9, VALARM is DISPLAY with an absolute UTC `TRIGGER;VALUE=DATE-TIME` for 09:00 Singapore on the preceding civil day, with no RELATED parameter. Independent ical.js tests assert 20261023T010000Z / 20261106T010000Z / 20261028T010000Z for sample deadlines 24 Oct / 7 Nov / 29 Oct and a year boundary. This pre-implementation specification correction replaces the original relative alarm, which could depend on the calendar user's timezone. No events for closed/unsure items.

### Evidence Export — evidence.ts
Implements prd.md > Reminders and Evidence Pack. buildEvidenceHtml creates script-free, self-contained escaped HTML with inline CSS, item results, exact passages/offsets, full SHA-256, answers, changes and convention; include the in-memory receipt image if supplied. No external URL dependency. Print hides controls; label sample data and “not legal advice.”

### Persistence — persist.ts (P1)
Implements prd.md > States and Boundaries. saveCase/loadCase use returnwindow.v1.case and a Zod schema matching CaseState. Validate dates, unique item IDs and spans against policy text. Invalid JSON/schema/span clears the key and shows a message. Persist text and extracted data, never receipt pixels.

### OCR Adapter — extract/ocr.ts
Implements prd.md > Receipt and Policy Input. recognizeImage uses a real Tesseract English worker, progress and AbortSignal. workerPath/corePath/langPath point to same-origin /ocr assets copied from dependencies, cacheMethod none. Terminate on cancel and release resources. Keep actual lines/words/confidence/boxes; do not manufacture an OCR error for the demo.

### PDF Adapter — extract/pdf.ts
Implements prd.md > Receipt and Policy Input. readPdf uses pdfjs-dist's local worker and rebuilds reading-order lines by y (±2 px), then x. Text-layer confidence is 100. No text layer explains the limitation and offers paste; P1 renders page one for OCR.

### Input Router — extract/input.ts
Implements prd.md > Receipt and Policy Input; States and Boundaries. documentFromText produces pasted-text lines at confidence 100; routeFile classifies image/PDF/text or unsupported. Enforce 15 MB receipt and 50,000-character policy limits; user errors remain recoverable.

### Case Store — state/case-store.ts
Implements prd.md > The Core Journey; One Question and Corrections. React useReducer owns CaseState and derives results. Read now once per recompute; tests inject it. Flow: empty → reading_receipt → receipt_ready/receipt_failed; receipt plus policy → workspace; answer/correction recomputes. Keep previous results for six-second “was → now” feedback. Start over clears state, P1 storage and object URLs.

### UI — App.tsx and ui/
Implements prd.md > Screens and Layout; Look and Feel. Render inputs, progress/cancel, editable receipt with boxes, cards, question, full highlighted policy, action bar and #evidence. Keep missing-policy refusal visible alongside the extracted receipt. Communicate status with words and accessibility semantics; do not let invalid spans render.

## Data Model
CaseState schemaVersion 1 is the source of truth: sample flag; receiptOcr (lines/words/boxes/confidence, no pixels); receipt (store, purchase date, items, total and warnings); deliveryDate; policy (label, normalized text, SHA-256, capturedOn and clauses); answers; corrections. Field values retain confidence, origin, raw source, line index, check flag and note.

Line items have stable IDs, description/amount fields, quantity, category provenance and final-sale marker. Clauses contain verified TextSpans for the whole quotation and its window/anchor/scope. Derived CaseResult contains refusal, item outcomes, ordered questions and Singapore today. Outcome variants: computed, needs_answer, unsure, not_returnable, no_policy_match, unsupported, conflict, missing_input. Only computed has deadline/start/window.

User input begins in memory; corrections create new state. Receipt pixels/object URLs stay in memory only. Reload starts empty until P1 persistence is added; then only the validated imageless case returns. The full type/API contract remains in plan §4 rather than being duplicated here.

## File Structure
Planned files, not implementation created in Stage 0:

```text
basics/
├── .agents/skills/                # installed course, unchanged
├── .gitignore                    # profile, secrets, dependencies, generated outputs
├── LICENSE / README.md           # licence and entry point
├── devpost/
│   ├── scope.md / prd.md / spec.md / checklist.md
│   └── learner-profile.md        # ignored personal context
├── docs/
│   ├── opus/                     # disclosed unchanged lead plan, brief and log
│   ├── process/skill-pack-run-log.md
│   ├── decisions/plan-vs-spec.md  # lead-owned reconciliation
│   ├── licenses.md / ocr-assets.json
│   └── test-report.md / submission-facts.md / demo-script.md
├── package.json / pnpm-lock.yaml / .npmrc
├── tsconfig.json / vite.config.ts / vitest.config.ts / playwright.config.ts
├── index.html                    # production CSP injection
├── scripts/
│   ├── copy-ocr-assets.mjs        # package assets → ignored public/ocr
│   └── render-fixtures.mjs        # synthetic receipts via Playwright
├── src/
│   ├── main.tsx / App.tsx         # entry and surfaces
│   ├── domain/
│   │   ├── types.ts / civil-date.ts / spans.ts / categories.ts
│   │   ├── receipt-parser.ts / policy-parser.ts / matcher.ts / engine.ts
│   │   ├── questions.ts / corrections.ts
│   │   └── ics.ts / evidence.ts / persist.ts
│   ├── extract/ocr.ts / pdf.ts / input.ts
│   ├── state/case-store.ts
│   └── ui/                       # controls, tokens.css, app.css, print styling
├── public/
│   ├── samples/receipt-demo-messy.png / policy-demo.txt
│   └── ocr/                      # generated and ignored
├── fixtures/
│   ├── policies/*.txt
│   └── receipts/                 # text/HTML/PNG/PDF, expected JSON, actual OCR golden
└── tests/
    ├── unit/                     # deterministic core, exports, persistence
    ├── ocr/                      # real engine, serial
    └── e2e/                      # production-preview journey and no-egress checks
```

Later course wrap-up may add devpost/app-map.html; Stage 0 creates no HTML companion.

## External Services and Dependencies
No external APIs, accounts, keys, backend, hosting or paid service. Network during install is limited to normal package-manager npm downloads. Build and runtime never call remote services; the browser may load only its own static assets. OCR models, workers and PDF workers are self-hosted; no CDN defaults, analytics or remote fonts. Documentation links above are planning references, not runtime calls.

Production-only CSP in built index.html (development needs HMR):

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; connect-src 'self' blob: data:; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none'; form-action 'none'">
```

Ignore .env/.env.* except secret-free .env.example, node_modules, dist, public/ocr, test-results, playwright-report and logs. All fixtures/policies are synthetic Juniper Lane Goods, no real retailer identity or personal receipt. Stage 0 installer access to GitHub is the explicitly authorized skill-install step, not an app runtime dependency.

## Important Failure Modes
- Messy OCR → check flags, editable source fields, visible recompute and actual recorded OCR evidence; unreadable images offer paste/manual entry.
- Missing, unsupported or conflicting policy evidence → clear refusal/non-computed reason, no fabricated date; corrupt offsets hide the highlight.
- Local assets, PDF worker or saved state fail → recoverable message; no CDN fallback. Invalid saved state clears; no-text PDF offers paste until P1.

## What Was Simplified and Why
No generative model in the MVP: Tesseract LSTM extraction plus deterministic rules makes the kernel falsifiable. No backend or policy scraper: the shopper supplies the evidence. Unsupported business days remain uncomputed. One receipt and one policy keep the flow testable; P1 saving omits pixels. P2 category suggestions are outside this spec's build and require the lead's separate gate after the release candidate; they never decide clocks.

## Decisions and Open Issues
Consequential technical choices are delegated agreement from brief §C and plan §§3–13, not established personal tooling preferences. The accepted tradeoff is local/offline operation with explicit OCR limits; no services or credentials. Component boundaries and function names are derived engineering detail. Personal tooling preference remains [JOHAN: personal tooling preferences — not established].

**One useful unknown:** “How reliable is on-device OCR on a messy receipt photo, and how do we stop a misread from silently producing a wrong deadline?” Confidence/check flags and editable fields explain the mitigation. During slice 3, run real OCR on clean, messy and blank synthetic images plus the text-layer PDF, record actual messy output and machine load, and test the correction journey. No accuracy or timing success is claimed yet.

**Verification:** plan §10 is the deep test record. Unit expectations assert the hand-calculated PRD dates; randomized date/span invariants and three timezone runs catch hidden assumptions. Use pnpm typecheck, pnpm test (maxWorkers ≤2), pnpm test:tz, serial pnpm test:ocr, pnpm build and pnpm test:e2e (one worker). Production E2E checks the image journey, refusal, unsure, exports, print, keyboard use, persistence if included, and zero other-origin requests. Never weaken tests to match observed output.

Before build/E2E/fixture rendering/long OCR runs, check uptime (load <12), matching heavyweight processes and memory_pressure (>25% free). Only one heavyweight job machine-wide; DEV has priority until 19 Oct 15:00 SGT. Poll 2–3 minutes up to 30 minutes, record waits/timings with load, and stop only processes this worker starts. No heavyweight job ran in Stage 0.

**Contingencies:** if Tesseract 7/core or PDF.js 6 actually fail in Vite, report evidence and use the plan's documented 6.x/5.x fallback only through review; record any narrow CSP adjustment. Selected pins resolving does not establish compatibility.

**Lead reconciliation notes:** reminders deliberately exclude computed-but-closed items per plan §10.6 I3 and PRD, qualifying plan §5.5 E5's unqualified one-to-one wording. The brief lists several saved receipts as a possible later idea while plan §2 excludes the dashboard; it remains outside this build. P1 persistence/mobile/scanned PDFs remain optional in scope, although staged slice/check targets schedule their investigation. The lead must record any required reconciliation in docs/decisions/plan-vs-spec.md; Stage 0 does not write that lead-owned decision. No blocking architecture question remains. Johan's personal review and hands-on calendar/demo check remain release gates.
