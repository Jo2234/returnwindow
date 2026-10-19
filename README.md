# ReturnWindow

Know the last day to return each item, and the policy line that proves it.

ReturnWindow is a local browser app for Singapore shoppers with mixed-item receipts. Add a receipt and the store's supplied policy, review separate item deadlines, answer one question when a clock is ambiguous, and correct extraction mistakes. Download calendar reminders and a printable evidence pack. Sample data is synthetic. Not legal advice.

**Current status:** G3 OCR/PDF/kernel accepted. S3 local verification passed on 18 Oct 2026: 131 unit tests, 49 in each of three timezones, 13 OCR/adapter tests, production build and six E2E cases. G4 was accepted by the Astra quota-fallback lead after the separately reserved UI walkthrough. The worker and lead inspected actual desktop/mobile views; all Johan final review/release gates remain pending. The [test report](docs/test-report.md), [G4 review](docs/checkpoints/g4-review.md) and [integration handoff](docs/final-handoff.md) distinguish retained evidence from remaining checks. Native G4 download metadata succeeded (ICS3031B/HTML473344B), but its payload read was NOT COMPLETED after tab closure; acceptance uses the separate S3 actual file reads/independent parser/HTML/print checks, with no native-copy claim.

The actual desktop workspace screenshot from the successful S3 production run at b702e4fe5deb639185dea3ea6ff891029aff0aac is retained on RP at `/tmp/basics-slot2-s3-shots/X7-workspace-1280x800.png`. It is not committed. Running the granted E2E command generates the local ignored `test-results/screens/X7-workspace-1280x800.png`; a fresh checkout has no screenshot at that path.

The [reference app map](devpost/app-map.html) follows an actual purchase-date correction into results and imageless persistence. Agent native desktop/mobile visual/navigation/focus checks passed on 19 Oct under the released 0858 grant; [the scoped review](docs/process/appmap-visual-review-20261019.md) preserves the tested artifact hash and network-capture limits. Johan viewing and the learning activity remain pending. See the [S4 audit](docs/process/s4-audit.md) and [technical video checklist](docs/video-checklist.md).

## Run locally

Node 24 or later and pnpm 12.11.2 are required. No account, API key, Docker or backend is needed.

```sh
pnpm install --frozen-lockfile
pnpm dev
# http://127.0.0.1:5188
```

For a production preview:

```sh
pnpm build
pnpm preview
# http://127.0.0.1:4188/?today=2026-10-20
```

The `today` parameter visibly labels simulated today; without it the app uses Singapore's current date. Both ports bind only to 127.0.0.1 with strictPort. Installation and dev/build preparation copy local OCR worker/core/model assets from installed dependencies into ignored public/ocr/. The amended manifest totals 31,347,373 bytes across 13 files, including two model-specific local notices; its original 11 entries remain unchanged. The two-file copier passed syntax/deterministic checks; fresh static-build packaging verification awaits the combined slot2 grant. No CDN download occurs at build/run time.

Verification commands are `pnpm typecheck`, `pnpm test`, `pnpm test:tz`, `pnpm test:ocr` and `pnpm test:e2e`. E2E starts its own production build/preview with one Chromium worker; do not start another preview on 4188. In the shared hackathon environment, full suites/builds/OCR/browser runs require the master reservation protocol; a low load or queue entry is not a grant.

## How this works

Tesseract reads English receipt images on the device. PDF.js reads a PDF's text layer; pasted text and text files enter the same parser. Extracted fields retain their confidence and source boxes. Fixed rules identify policy windows and categories while preserving exact quotations and character offsets. Calendar-date arithmetic computes a separate deadline for each supported item. It asks about an unspecified clock start and refuses unsupported, missing or conflicting evidence.

The real synthetic messy receipt is read as **5 Oct 2026**, against ground truth **8 Oct 2026**. Before correction, the shirt is 4 Nov and mug 26 Oct. Answer delivery 10 Oct, then correct purchase 05→08: the shirt becomes 7 Nov, mug 29 Oct, and delivery-anchored earbuds stay 24 Oct. The final-sale scarf stays not returnable. The proven receipt/golden are preserved; no target misread is forced.

Calendar files include computed, unexpired items only. Events are all-day DATEs with next-day exclusive ends, a stable UID, verbatim stored store name and policy evidence. Absolute UTC alarms encode 09:00 Singapore on the preceding day. Evidence HTML contains escaped text, passages/offsets, full policy hash, answers, changes and an optional embedded raster receipt. It has no scripts or external fetch resources; printing hides the in-app controls.

A single imageless case is saved locally after a 300 ms debounce. Reload restores validated extracted text/evidence, not receipt pixels. **Start over clears it; reload cannot restore a deliberately cleared case.** Corrupt saved state is removed with a message. A compact receipt preview opens the full image when needed; desktop columns scroll within their reserved area, and mobile stacks below 720 px.

## Date convention

Dates are calendar dates in Singapore time (Asia/Singapore). The day of purchase or delivery counts as day 0. A 30-day window ends at the end of day 30. 'Days' with no qualifier are treated as calendar days. A one-month window ends on the same date next month, or on the month's last day if that date doesn't exist.

The original relative alarm recipe did not guarantee 09:00 Singapore when a calendar user had another timezone. [Decision 8](docs/decisions/plan-vs-spec.md) corrects the specification before implementation: for 24 Oct 2026 the alarm is 20261023T010000Z; for 7 Nov, 20261106T010000Z; for 29 Oct, 20261028T010000Z. DTSTART/DTEND stay DATE; no RELATED parameter is attached to the DATE-TIME trigger. Independent ical.js tests assert these instants and a year boundary.

## Modes, privacy and limits

Extraction: on-device OCR (Tesseract LSTM) + deterministic rules. No generative AI model is used to compute deadlines.

OCR/PDF are real local libraries. There are no sponsor APIs, remote models, analytics, fetched retailer policies or uploads. Production CSP restricts the app to same-origin assets; the standalone evidence file disables external sources. No P2 local category suggester is included. The browser holds images only in memory and releases object URLs/workers on cleanup; localStorage holds extracted text and evidence. Exported evidence may contain an image when explicitly included.

Only English policy clocks and SGD display are supported. The app does not interpret conditions such as “unopened”, determine legal rights/refund amounts, or compute business-day/public-holiday deadlines. Review quoted conditions and check with the store. OCR can misread confidently. Optional scanned-PDF browser and separate browser-unmount checks remain unexercised; labels must not imply they passed. Calendar-client import and final hands-on review remain Johan's.

## How it was built

The repository started empty on18 Oct 2026; its first action installed the [Devpost Learn Skill Pack](https://github.com/challengepost/learn-ai-basics), MIT ©2026 Devpost. Installed 1-start→2-scope→3-prd→4-spec generated the authentic [scope](devpost/scope.md), [PRD](devpost/prd.md), [spec](devpost/spec.md) and [5-build checklist](devpost/checklist.md). The installed 5-build workflow is used for implementation slices, verification, commits and explicit revisions. Learner-side product answers/approvals were delegated from an approved brief; personal answers, hands-on checks and final personal review remain Johan's. No learning reflection is fabricated.

Claude Opus 5.5 HIGH authored the original plan and G1/G2 reviews. GPT-6 Astra HIGH is the authorized quota-fallback specification/review lead for G3/G4 and decisions 8–11. GPT-6.1 Sol HIGH implements the application and tests. Neither planning lead writes implementation. The original plan was written outside the repo during the submission window and [copied into docs/opus after skill generation](docs/opus/README.md). See the [process record](docs/process/skill-pack-run-log.md). No pre-existing application code was incorporated.

React/Vite/TypeScript provide the interface and build; Tesseract/PDF.js provide local extraction; Zod validates storage. Vitest/fast-check test the kernel, dev-only ical.js/jsdom independently parse exports, and Playwright tests production Chromium. [Licences and provenance](docs/licenses.md) record the now-substantiated Apache-2.0 model chain separately from npm-package MIT metadata, preserve caniuse-lite CC-BY4.0 / dev-only mdn-data CC0 notices and distinguish implemented notice copying from pending fresh static-build packaging verification. See [supplementary notices](THIRD_PARTY_NOTICES.md). ical.js MPL-2.0 is dev-only. [MIT licence](LICENSE), ©2026 Jo2234.

The repository stays private until Johan authorizes release. Video/narration, description, “what I learned”, personal review, Calendar import, public release and Devpost submission are human gates. Nothing has been registered, posted, deployed or publicly submitted by this worker.

Private 19 Oct delivery drafts: [release notes](docs/delivery-20261019/release-notes.md), [storyboard](docs/delivery-20261019/demo-storyboard.md), [submission draft](docs/delivery-20261019/submission-draft.md). These retain Astra draft attribution, Sol factual amendments and Johan personal placeholders; no publication or human sign-off is claimed.
