# ReturnWindow — neutral submission facts

Status: G3 local kernel/OCR/PDF accepted. S3 full local regression and production checks passed at b702e4fe5deb639185dea3ea6ff891029aff0aac: 131 unit tests, three timezone runs of 49, 13 OCR/adapter tests, production build and six E2E cases. Worker screenshot review and subsequent separate lead UI walkthrough completed; G4 local release candidate accepted. Native payload read remains NOT COMPLETED; separate S3 actual-file/independent export checks support acceptance. These are factual preparation notes, not Johan's description or “what I learned”.

Audience: Singapore shoppers with mixed-item receipts and supplied English store policies. The product associates a separate supported return date with each item and quotes the exact policy passage. One question resolves an ambiguous clock; unsupported/conflicting/missing rules do not become guessed dates.

Inputs: real local Tesseract 7 image OCR, PDF.js 6 text-layer extraction, pasted/text files; synthetic Juniper Lane Goods sample. Confidence/check flags and source boxes remain editable. The actual messy date is 05 Oct instead of ground-truth 08 Oct; the preserved fixture enables a real correction demonstration. All fixture amounts remain independent ground truth.

Outputs implemented: all-day calendar reminders for computed unexpired items, absolute 09:00SGT preceding-day UTC alarms, exclusions/reasons, script-free self-contained printable/downloadable evidence with escaped user text, passages/offsets/hash, answers and timestamped changes. Imageless single-case storage restores validated text/evidence; Start over clears it permanently until a new case is supplied. Desktop compact preview retains full-image access; narrow screens stack.

Technology: React 19, TypeScript 6, Vite 7, Tesseract.js7 with self-hosted English model/core/worker, PDF.js 6, Zod 4. Vitest 4/fast-check and independent dev-only ical.js 2.2.1/jsdom 30.1.3 plus Playwright 1.64.1. No backend, API key, sponsor API, remote model or public deployment. Extraction mode: on-device Tesseract LSTM plus deterministic rules; no generative model computes deadlines.

Process provenance: genuine installed Devpost Learn Skill Pack, authentic scope/PRD/spec/checklist, repeated installed 5-build slice/revision workflow. Original plan and G1/G2: Claude Opus 5.5 HIGH. G3/G4/reconciliation: GPT-6 Astra HIGH authorized quota fallback, specification/review only. Application/tests: GPT-6.1 Sol HIGH. Original plan was written outside the empty repo during the build window and copied in after skill-generated documents; no pre-existing application code was incorporated. Personal claims, experiences, product feedback and learning reflections are not invented.

Limitations and gates:

- Calendar dates use Asia/Singapore with purchase/delivery as day 0. Business days/holidays and condition interpretation are unsupported. Amounts are display-only; this is not legal advice or a refund calculator.
- OCR can misread confidently. Users review flags, image/text and policy conditions. No real receipts or retailer identities appear in fixtures.
- Optional scanned-PDF browser and separate browser-unmount scenarios remain unexercised. G4 accepts the local candidate, not Johan final approval. The evidence table final column still wraps narrowly; the lead retained it as a minor visual limitation.
- 19Oct exact-content research substantiates the model's official Apache-2.0 chain separately from npm MIT. Complete source notices preserve caniuse-lite CC-BY4.0 and dev-only mdn-data CC0 data terms; the authorized copier/manifest amendment adds the model-specific notice pair, with syntax/deterministic checks passed and fresh static-build output verification pending. No legal clearance. Project code is MIT; ical.js MPL-2.0 is dev-only.
- Human Calendar import, print review, final hands-on checks, narration/video, personal submission text, repository publication and registration/submission remain Johan's. Repository stays private. No users, impact statistics, interviews, personal learning outcomes or public acceptance are fabricated.

19Oct agent app-map desktop/mobile visual/navigation/focus validation passed under released grant0858; no learner viewing/learning is inferred. Current private technical submission draft is Astra-authored under direct19Oct authorization, with Sol factual notice/map amendments and Johan personal placeholders.
