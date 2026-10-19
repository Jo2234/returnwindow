# ReturnWindow verification record

18 October 2026. **S3 local verification passed** at b702e4fe5deb639185dea3ea6ff891029aff0aac under explicit master grant heavy-basics-s3-slot2-20261018-1342. All six commands exited 0: 131 unit tests, three timezone runs of49, 13 OCR/adapter tests, production build and six E2E cases. Worker review of all seven actual viewport screenshots completed. G4 subsequently accepted32359b9; reviewed checklist-only94d1986 marked slices4–5 mechanically complete. All Johan/final-review/learning boxes remain unchecked. See the S4 integration addendum below. Earlier drafting entries below remain historical records. Latest19Oct combined build/evidence acceptance is recorded at the end; its raw harness FAIL/exit1 remains a failure, separately from completed work checks and later cleanup.

## Authorship and baseline

Claude Opus 5.5 HIGH authored the original plan and G1/G2 reviews. GPT-6 Astra HIGH, authorized quota fallback, accepted G3 and authored S3 reconciliation decisions 8–11. GPT-6.1 Sol HIGH implements application code/tests, using the actually installed Devpost 5-build workflow; the generated records are retained with explicit revisions. No learner actions, personal learning claims or final release approval are inferred.

Base main: e8d603c (S2 merged). Prior G3 accepted evidence: 23af61860c9700a5dc40f95fa4ee7bb9c0183271; build-tested b360f1031ef65531794c60b4ded891e81e44d5be; browser-tested cc0534311453a107f5588f429e387044682f582c. See docs/checkpoints/g3-review.md and devpost/checklist.md for raw prior failures and grant receipts.

## Commands run during S3 drafting

| Command | Observed result |
|---|---|
| pnpm add --save-dev --save-exact ical.js@2.2.1 jsdom@30.1.3 | Pass; exact dev-only pins installed |
| pnpm typecheck | Initial failure: incorrect generic type arguments in independent ical.js test calls; corrected to installed declarations. Subsequent passes; latest complete drafting check reported below |
| pnpm vitest run tests/unit/ics.test.ts --maxWorkers=1 | 5/5 pass, one file; absolute UTC alarms, next-day DATE end, verbatim SUMMARY, UTF-8 folding/escaping, exclusions, year boundary |
| pnpm vitest run tests/unit/evidence.test.ts --maxWorkers=1 | Initial 3/4 pass: overly broad checker matched CSP attribute http-equiv; changed to HTTP URL detection while retaining independent DOM no-fetch/XSS assertions. Then 4/4 pass |
| pnpm vitest run tests/unit/persist.test.ts --maxWorkers=1 | Initial 7/7 pass; added zero-day-policy round-trip after source review to ensure schema accepts a supported parser value; latest result recorded below |
| pnpm licenses list --json > /tmp/basics-slot2-s3-licenses.json | Pass; refreshed docs/licenses.json and flags |
| Node contrast calculation, standard sRGB luminance formula | All listed text pairs ≥4.5:1; form-border/focus pairs ≥3:1 |

No timing benchmark is claimed for these small checks; contemporaneous uptime was not captured for their individual durations. A read command initially used a missing persistent cwd binding and failed before reading files; repeated with the absolute worktree path. One CSS patch was rejected before any edit due to duplicate file operations and was reapplied correctly. No test assertion was weakened to match application output, no test was skipped, and no fixture was regenerated.

## Granted full verification — passed

Grant heavy-basics-s3-slot2-20261018-1342 named this original slot2 worker, clean b702e4f and both pinned test/config hashes. The following exact sequential batch ran once, with stop-first-command-failure/no-retry conditions:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm test:tz
pnpm test:ocr
pnpm test:e2e
```

The last command successfully ran its internal `pnpm build && pnpm preview` via Playwright webServer; one Chromium worker, six serial cases, maxFailures1/retries0, loopback4188 only. The worker reported start/results/cleanup to lead and master. The master alone releases the reservation. No fixture rendering, extra browser/server or additional heavyweight command ran.

## Acceptance coverage

- Existing D1–D16, W1–W18, W12/P1 fuzz, P1–P10, demo/C1 and real O1–O4 remain unchanged. O1/O3 retain four exact amounts 8900/4590/1850/1200 and total16540.
- I1–I4: ical.js parses all-day dates and independent absolute UTC alarms for 24 Oct / 7 Nov / 29 Oct: 20261023T010000Z / 20261106T010000Z / 20261028T010000Z; 1 Jan2027 independently expects 20261231T010000Z. The pre-implementation specification correction is decision8, not a waiver. Stored store remains verbatim JUNIPER LANE GOODS.
- E1: jsdom checks used full passages/offsets/hash, answers, changes, synthetic label and convention; hostile user strings cannot create active elements/event handlers. Only base64 raster receipt images are embeddable. No scripts or external fetch resources.
- E2 / X1–X7: drafted production E2E exercises actual05→08, pre04Nov/26Oct, delivery answer before correction and earbuds24Oct invariant; three-event download; print-hidden controls; refusal; unsure; reload; deliberate clear surviving another reload; keyboard; zero other-origin page/worker/core/model requests; desktop/mobile screenshots. Additional PDF/blank/cancel/replacement regression keeps the S2 lifecycle checks.
- Imageless storage is validated with Zod 4: dates, confidence, unique item ids, strict fields, P1 policy spans and kind/window consistency. Corrupt state is removed; Start over clears immediately and cancels pending debounced writes.

## Actual viewport review

X7 recorded **viewport screenshots**, not full-page substitutes: 1280×800 start, workspace, question and evidence; 390×844 start/workspace/evidence. All seven were copied from ignored test-results/screens/ to /tmp/basics-slot2-s3-shots/ and visually inspected by the worker. README links the generated local desktop artifact, which now exists. Screenshots are not committed.

Observed desktop: compact receipt with full-image access; earbuds24Oct/shirt7Nov/mug29Oct visible after correction, dates and action bar separated without overlap. The initial question image shows05Oct/shirt4Nov/mug26Oct. The lower scarf card and receipt details remain reachable through independent column scrolling. Observed mobile: stacked panels, readable item dates, static actions and no horizontal overflow. Evidence displays its table and print/download controls; its narrow passage column wraps awkwardly at both sizes, especially390px. This is recorded for G4 review, not silently declared polished. No application/CSS change followed this run.

## Contrast calculation

Ratios use (lighter relative luminance +0.05)/(darker +0.05), with sRGB channel linearization at 0.04045. Normal text criterion 4.5:1; essential control outlines 3:1. Default placeholder text is set to muted with opacity 1. Subtle card borders are decorative separators, not sole control boundaries.

| Pair | Foreground | Background | Ratio | AA criterion |
|---|---|---|---|---|
| Ink / paper | #1E2330 | #F6F3EA | 14.14:1 | 4.5:1 normal text |
| Ink / white | #1E2330 | #FFFFFF | 15.69:1 | 4.5:1 normal text |
| Muted / white | #5A6072 | #FFFFFF | 6.27:1 | 4.5:1 normal text |
| Muted / paper | #5A6072 | #F6F3EA | 5.65:1 | 4.5:1 normal text |
| Muted / neutral | #5A6072 | #EEEDE8 | 5.35:1 | 4.5:1 normal text |
| Ink / neutral | #1E2330 | #EEEDE8 | 13.39:1 | 4.5:1 normal text |
| White / blue | #FFFFFF | #2647D0 | 7.26:1 | 4.5:1 normal text |
| Blue / paper | #2647D0 | #F6F3EA | 6.54:1 | 4.5:1 normal text |
| Blue / tint0 | #2647D0 | #DCE6FF | 5.81:1 | 4.5:1 normal text |
| Green / white | #1D7A4B | #FFFFFF | 5.33:1 | 4.5:1 normal text |
| Green / green tint | #1D7A4B | #E6F4EC | 4.70:1 | 4.5:1 normal text |
| Amber / amber tint | #8A5300 | #FFF3D6 | 5.74:1 | 4.5:1 normal text |
| Amber / white | #8A5300 | #FFFFFF | 6.33:1 | 4.5:1 normal text |
| Red / red tint | #B42318 | #FDECEA | 5.75:1 | 4.5:1 normal text |
| Red / white | #B42318 | #FFFFFF | 6.57:1 | 4.5:1 normal text |
| Ink / passage0 | #1E2330 | #DCE6FF | 12.56:1 | 4.5:1 normal text |
| Ink / passage1 | #1E2330 | #FFE3C2 | 12.72:1 | 4.5:1 normal text |
| Ink / passage2 | #1E2330 | #D9F2E3 | 13.27:1 | 4.5:1 normal text |
| Ink / passage3 | #1E2330 | #F3DDF5 | 12.31:1 | 4.5:1 normal text |
| Form border / white | #818794 | #FFFFFF | 3.60:1 | 3:1 non-text |
| Focus blue / white | #2647D0 | #FFFFFF | 7.26:1 | 3:1 non-text |
| Focus blue / paper | #2647D0 | #F6F3EA | 6.54:1 | 3:1 non-text |

## Honest limits and human gates

Optional scanned-PDF browser and separate component-unmount browser scenarios remain unexercised. OCR can misread confidently; the real messy fixture is 05 Oct (line92/date-word 80), not the earlier06 target. Full-image access, flags and corrections remain important. No conditions such as “unopened” are interpreted; no business-day/holiday arithmetic or legal advice. Calendar-client import behavior, print output in an actual printer, final hands-on review, video, personal submission text, publication and submission remain Johan's.

Licence flags remain in docs/licenses.md: traineddata-specific upstream notice not independently confirmed; caniuse-lite CC-BY4.0 data; new dev-only mdn-data CC0-1.0 data. No sponsor API exists or was called. No public release, push, merge or conversation export occurred.

Latest drafting checks: `pnpm vitest run tests/unit/persist.test.ts --maxWorkers=1` passed 8/8 after adding the supported zero-day policy case; `pnpm typecheck` passed with export UI and all six drafted production E2E cases included. The compatibility fix keeps zero-day policies restorable rather than tightening the original parser's accepted grammar. No final-suite or browser invocation has occurred in S3.

A final source-review addition labels expired computed dates “Closed” in evidence and uses human-readable refusal reasons in export exclusions. `pnpm vitest run tests/unit/evidence.test.ts --maxWorkers=1` then passed 5/5 including the independent closed24Oct / still-open29Oct assertion; the ICS single-file check passed5/5 again. No existing expectation or fixture was removed or weakened. E2E now also drafts corrupt-save toast/removal and manual receipt recovery. Six tests remain, maxFailures1/retries0; stopping the suite after its first failure does not mark the unexecuted checks as passed.

Final drafting `pnpm typecheck` passed with the latest source/tests; start uptime13:38SGT, up9days2:22, load2.47/2.60/2.95. This is a light static check; no S3 production build or browser review is implied.

## Grant receipt and observed counts

Execution05:43:38–05:44:18Z, approximately40s, no overrun of180s estimate. Preflight13:43SGT: up9days2:27, load2.56/2.59/2.83, memory43% free,4188 clear. Raw logs /tmp/basics-slot2-s3-grant-1342/{status,1,2,3,4,5,6}.log. All exits0, no failures/skips/retries.

| Exact command | Result | Observed duration | Start uptime/load |
|---|---|---|---|
| pnpm install --frozen-lockfile | Pass; lock current; pnpm12.11.2 |104ms reported|13:43 up9d2:27;2.46/2.56/2.81|
| pnpm typecheck | Pass |05:43:39–05:43:42Z|13:43 up9d2:27;2.46/2.56/2.81|
| pnpm test |131/131;10files|3.01s|13:43 up9d2:27;2.46/2.56/2.81|
| pnpm test:tz |49/49 UTC,49/49 America/Los_Angeles,49/49 Pacific/Kiritimati|801/841/875ms|13:43 up9d2:27;2.66/2.60/2.83|
| pnpm test:ocr |13/13;2files, real O1–O4 unchanged|4.23s total;3.65s test execution|13:43 up9d2:27;3.09/2.69/2.86|
| pnpm test:e2e |6/6; includes successful build/preview|22.1s|13:43 up9d2:27;2.92/2.66/2.85|

End13:44SGT up9d2:28, load3.73/2.88/2.92. OCR per-O console durations were again absent from captured Vitest output; no individual values are invented. The real recording durations842/854ms with contemporaneous uptime remain the earlier G3 fixture evidence, not new S3 timings.

E2E hook wall measurements (actual, include hook overhead): integrated X1/X4/X5/X7 4388ms; X2 402ms; X3 532ms; X6 1962ms; mobile X7 819ms; S2 input regression3701ms. Corresponding uptime is13:44 up9d2:28, load3.86/2.87/2.92 before the first and3.79/2.87/2.92 through keyboard, then3.73/2.88/2.92 for mobile/input. These are observations on the shared machine, not performance claims.

Production build emitted upstream Zod PURE-comment annotation warnings (Rollup removes those comments) and NO_COLOR/FORCE_COLOR environment warnings. Build and all tests still exited0; browser console/page errors were empty. No CSP relaxation was made.

X4-network.json reports passed=true/stage=complete,20 requests (including same-origin blobs), one same-origin OCRworkerURL, zero other-origin requests and errors[]. Actual request evidence includes self-hosted worker/core/model. Exact production CSP is stored in the JSON. X1 verified three downloaded all-day ICS events and the three independent UTC alarm instants; HTML download included embedded PNG, escaped evidence and changes. Print emulation hid controls. Reload/restoration, permanent clear across reload and invalid-save clearing passed. Other E2E cases verified refusal/disabled export, unsure/two events, keyboard focus,390px geometry, exact PDF amounts and paste/manual recovery/cancel/replacement cleanup.

## Screenshot inventory and cleanup

All paths below are under /tmp/basics-slot2-s3-shots/ and also remain in ignored test-results/screens/:

- X7-start-1280x800.png
- X7-question-1280x800.png
- X7-workspace-1280x800.png
- X7-evidence-1280x800.png
- X7-start-390x844.png
- X7-workspace-390x844.png
- X7-evidence-390x844.png
- X4-network.json

Verified cleanup: runner69416; unit processes69509/69510/69516/69517/69525/69526/69527; E2E69751/69752/69758/69759; webServer/build69772/69773/69779/69790/69792; preview69837/69843/69854/69855/69863; worker69870; Chromium69881/69882/69883/69884 all absent. No owned groups69416/69772/69779/69790/69843/69854/69881 remained;4188 had no listener; no matching Basics preview/test/OCR or cachedChromium1248 process. Pre-existing shared T3 browser was untouched. Master alone releases the reservation. Source and both pinned hashes remained unchanged after execution; subsequent changes are documentation only.

## S4 exact-tree integration and artifact preparation

Original slot1 merged reviewed 94d1986b23afe177720471a8baa33eb949eaaa59 as 84e00be46f096e5bb8cb2df512c2e106e94c9a11 without conflicts; immediate `git diff --exit-code 94d1986b23afe177720471a8baa33eb949eaaa59 HEAD` passed with an empty tree delta. Application/test/style/lock content equals tested b702e4fe5deb639185dea3ea6ff891029aff0aac; subsequent accepted and S4 changes are documentation only. No install/typecheck/test/TZ/OCR/build/browser rerun was authorized or performed in S4.

Native G4 download metadata succeeded (ICS 3031 B / HTML 473344 B), but the lead closed the tab before retaining the temporary paths. Native payload read: **NOT COMPLETED**. No retained native payload copies are claimed. Acceptance relies separately on the passing reserved S3 actual downloaded-file reads, independent ical.js/HTML assertions and print-emulation checks plus the completed live G4 UI walkthrough. No assertion was waived, and no redundant browser rerun was performed.

[G4 review](checkpoints/g4-review.md), [source review](checkpoints/s3-source-review.md) and [final handoff](final-handoff.md) preserve exact grants, SHAs, retained evidence paths and minor/optional limits. Static artifact and full reachable-history audit results are in [S4 audit](process/s4-audit.md); app-map agent native visual check subsequently [passed19Oct](process/appmap-visual-review-20261019.md) under released grant0858. No full5-build/6-ship or human release completion is claimed.

## 19 Oct document/notice-only follow-up

Agent native app-map visual validation passed on 19 Oct 2026 under heavy-basics-appmap-lead-20261019-0858 (master CLOSED/RELEASED PASS): desktop1280×800/mobile390×844, three retained screenshots, same-document navigation/details and keyboard focus, no overflow. Reviewed artifact SHA-2563cfd682f37da5c86229c854dd0be0f8086a4774a6efc5c92056fcf713035a1dc at source6b5a58d. Native network/console arrays were empty; server log records one local GET, so this is not exhaustive document-request capture. No remote request was observed. Johan viewing/learning/final review remains pending. The original app-map source hash was the reviewed artifact; current factual text changes preserve CSS/tag structure and did not trigger another visual run. Notice research used read-only installed-byte hashing/decompression, dependency metadata and bounded authoritative notice/metadata requests. It did not repeat the passed S3 application checks or alter application/test/model/lock content. The model-specific upstream chain is substantiated; full sources and the implemented notice-copy amendment (the then-pending build verification completed later under0909, recorded below) are in [the investigation](notices/provenance-investigation-20261019.md). Historical18Oct uncertainty/timing/failure entries above remain their original snapshots.

## 19 Oct combined evidence-layout / notice integration

Tested/reviewed source: 6cd7b5c0418a6e06d8efd60a463fd8dac728bb7c. Exact no-ff main merge: 64f8e339c2f4d7503e4d5612564bb3274c73a799; immediate `git diff --exit-code 6cd7b5c0418a6e06d8efd60a463fd8dac728bb7c HEAD` passed. Both full merge/input tree IDs are be6d6f5c4f0662616e21f4e6d261b234778ef5ae. Final documentation additions are separate; the final worker report/package manifest supplies the resulting source SHA.

Under heavy-basics-evidence-notice-slot2-20261019-0909, `pnpm build` exited0, including local13-asset copy and TypeScript check. The one pinned `node /tmp/basics-slot2-evidence-readability-check-r2.mjs` invocation exited1: raw status fail, stage complete, failure null, evidenceErrors empty. **The harness is FAIL, not a green batch.** Its13 original/source/public/dist asset comparisons and all eight measurements (four screen/four print) completed before cleanup. Original11 assets are unchanged; the notice1516B/bd25056b2ebb52f824e4abbbfec58a9d56651d56b53c23beef9c52fa57c20926 and Apache text11358B/cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30 match source/public/dist, total31347373B. Existing upstream Zod PURE-comment warnings remain.

The in-app and retained standalone evidence views measured1280×800 and390×844 with14px text, matching document widths, no clipped cells and unbroken Evidence/Passage N labels; mobile rows are full-width and labelled. Four print emulations preserve table/row/cell structure and hide duplicate labels; two A4 PDFs are retained. This resolves the earlier narrow evidence-column observation for these reviewed views. It is print emulation, not Johan's printer/Calendar. The text-only scenario preserves recorded05→08, pre04Nov/26Oct, post07Nov/29Oct and delivery10Oct→24Oct invariant; it did not run OCR or repeat persistence/lifecycle checks. Four requests were three loopback application resources and the retained local file; no remote/worker URLs or console/page errors.

Actual retained HTML:9477B, SHA-256046721f77bbe21aeca761ca49c0bd2b6be1735d1322b924f03f067b39cd837c9. It was saved/read before teardown; this text-only export contains no receipt image. Historical S3 image-embedding and independent ICS/parser checks remain separate. The new retained HTML does **not** retroactively complete G4's lost native ICS3031B/HTML473344B payload read.

Cleanup snapshot: previewPID39238 was defunct in its group (PPID39184), so the group-not-empty assertion correctly caused exit1 despite survivors[]/port4188Free=true. After node39184 exited, worker, lead and master separately found recorded identities/groups absent and4188 without a listener. Master CLOSED/RELEASED0909. No waiver, assertion change, retry or rerun; the raw failed report is preserved.

Records: [lead review](process/evidence-notice-review-20261019.md), [source review](process/notice-layout-source-review-20261019.md), [raw failed result](process/evidence-notice-0909-result.json), [later lead cleanup](process/evidence-notice-cleanup-review-20261019.json), [master closure](process/master-0909-closure.json). Originals remain in control; raw logs/artifacts remain at /tmp/basics-evidence-notice-20261019-0909-{build,harness}.log and /tmp/basics-slot2-evidence-readability-shots/2026-10-19T01-10-06-717Z/. This integration ran no install, test, build, browser or OCR.

Raw result SHA-256:c46393a8ee7ec95180bb95f94f6b4f7b06e6acf112496717a243abca1561991a. Harness SHA-256:a9e5a8d89a6d4549d389a7c0bdb19b8a3b7865b02f94ac7b710a298e6d340d1c. Targeted evidence6/6 plus typecheck were accepted separately at87441c5; the initial added-test SKU-prefix mismatch and label-only test correction remain documented in the source review. No full-suite count is inferred for6cd7b5c; historical S3 counts remain atb702e4f. This finalization ran source/hash/link/history checks only.
