# ReturnWindow verification record

18 October 2026. S3 draft: **targeted checks passed; final full regression/build/E2E and visual review are pending an explicit master grant.** Slices 4–5 remain unchecked. A passing S2 result is not claimed as verification of the changed S3 app.

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

## Required final commands — not yet run on S3

A fresh unique explicit master grant naming this worker and exact commands is mandatory. Request one bounded sequential batch, stop on first failure, no automatic retries:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm test:tz
pnpm test:ocr
pnpm test:e2e
```

The last command internally runs `pnpm build && pnpm preview` via Playwright's webServer config; one Chromium worker, retries 0, loopback 4188 only. The worker will report start PID/checkout/load, each exit, failures/skips, uptime with timings and descendant/group/port cleanup. The master alone releases the reservation. No fixture rendering is requested.

## Acceptance coverage

- Existing D1–D16, W1–W18, W12/P1 fuzz, P1–P10, demo/C1 and real O1–O4 remain unchanged. O1/O3 retain four exact amounts 8900/4590/1850/1200 and total16540.
- I1–I4: ical.js parses all-day dates and independent absolute UTC alarms for 24 Oct / 7 Nov / 29 Oct: 20261023T010000Z / 20261106T010000Z / 20261028T010000Z; 1 Jan2027 independently expects 20261231T010000Z. The pre-implementation specification correction is decision8, not a waiver. Stored store remains verbatim JUNIPER LANE GOODS.
- E1: jsdom checks used full passages/offsets/hash, answers, changes, synthetic label and convention; hostile user strings cannot create active elements/event handlers. Only base64 raster receipt images are embeddable. No scripts or external fetch resources.
- E2 / X1–X7: drafted production E2E exercises actual05→08, pre04Nov/26Oct, delivery answer before correction and earbuds24Oct invariant; three-event download; print-hidden controls; refusal; unsure; reload; deliberate clear surviving another reload; keyboard; zero other-origin page/worker/core/model requests; desktop/mobile screenshots. Additional PDF/blank/cancel/replacement regression keeps the S2 lifecycle checks.
- Imageless storage is validated with Zod 4: dates, confidence, unique item ids, strict fields, P1 policy spans and kind/window consistency. Corrupt state is removed; Start over clears immediately and cancels pending debounced writes.

## Visual review — pending

X7 records **viewport screenshots**, not just full-page captures: 1280×800 start, workspace, question and evidence; 390×844 start/workspace/evidence. Files will be generated in ignored test-results/screens/ and copied to /tmp/basics-slot2-s3-shots/ after the granted run. None has been generated or visually reviewed yet for S3. README's screenshot link targets that generated local artifact and will exist only after successful X7 execution.

Desktop layout allocates bounded independently scrollable columns, a compact receipt preview and a full-image dialog. The action area has its own normal-flow region to prevent overlapping the scrollable workspace; mobile actions are static. E2E asserts action geometry and no horizontal overflow. These remain implementation intentions until the actual screenshots are inspected.

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
