# G4 local release-candidate review — accepted

Reviewer: GPT-6 Astra HIGH in the existing Basics lead thread, 18 October 2026, authorized quota fallback for specification/review only. Original plan and G1/G2: Claude Opus 5.5 HIGH. Application and tests: existing GPT-6.1 Sol HIGH slot2. This is not final judging/submission approval.

Accepted source and evidence commit: `32359b97d55169ab591120517bf03f062dec93d6`, branch `codex/slot2-exports-polish`. Tested application commit: `b702e4fe5deb639185dea3ea6ff891029aff0aac`. The five-file delta is documentation only; all 19 built files matched the pinned manifest before the lead walkthrough. No merge has occurred yet.

## Evidence

S3 grant `heavy-basics-s3-slot2-20261018-1342`: frozen install, typecheck, 131 unit tests, 49 tests in each of UTC/Los Angeles/Kiritimati, 13 OCR/adapter tests and six E2E cases all passed, once with no retries. The E2E command included the successful production build. Lead reviewed raw logs, X4 network evidence and all seven worker screenshots. Build warnings about upstream Zod PURE annotations and color environment variables are retained. Master verified cleanup and released this grant.

Lead grant `heavy-basics-g4-lead-20261018-1348`: one `pnpm preview`, one native T3 browser tab, 1280×800 and optional 390×844 on the same tab. From 05:48:39 to 05:50:07Z (~88 seconds, within estimate), the lead directly exercised the synthetic sample, actual purchase date 05 October with Check this, four item cards including scrolling to the final-sale scarf, full-size receipt with boxes, linked policy passages, delivery 10 October before purchase correction to 08 October, resulting shirt 07 November and mug 29 October with earbuds still 24 October, calendar download, evidence view/download, imageless restore, and deliberate clear followed by empty reload. The final read showed localStorage keys empty and zero item cards. Native diagnostics retained 18 same-origin network entries, including local OCR worker/core/model; console entries empty.

The desktop actions are reachable below the bounded workspace. The full receipt dialog permits comparison with the real synthetic image. At 390px the evidence table wraps its final column narrowly; text remains available and no substantive workflow failure was found. This is a minor visual limitation, not a reason to alter the tested release candidate now.

## Evidence-retention limitation and disposition

The native browser reported completed downloads with expected names (ICS 3031 bytes; HTML 473344 bytes). The lead closed the tab before copying those temporary paths; the paths were absent afterward. Consequently, this lead did NOT inspect the downloaded payload bytes and no retained lead copies are claimed. This post-walkthrough collection error is preserved. No browser scenario was retried. A malformed role selector using unsupported `[exact=true]` was rejected before acting; the locator was corrected from a fresh accessibility snapshot. This was a tool-input error, not an application assertion failure.

Export payload acceptance is supported by the already-passing reserved S3 E2E, whose downloadText helper actually reads each downloaded file before teardown. It independently parses three calendar events and the exact UTC alarms with ical.js, checks HTML synthetic disclosure/no scripts/no HTTP references/embedded image/05→08 correction, and emulates print with controls hidden. Independent unit tests cover DATE boundaries, absolute alarms/no RELATED, year rollover, UTF-8 folding/escaping and DOM injection rejection. The lead reread these assertions and passing logs. No assertion is waived and no additional test rerun is needed solely to duplicate this evidence. Calendar-app import and real print/PDF review remain Johan's hands-on gates.

## Cleanup and retained records

Native tab `tab_5_65636871-9c2a-4de7-b335-483136d0d925` closed; preview_status returned no tab. Owned service PID/PGID 70993 absent, no matching Basics preview process and no listener on 4188. `pnpm preview` was started once; no build/test/fixture command or application edit occurred. Master alone releases the reservation.

Lead records: `/tmp/basics-g4-lead-walkthrough/` contains start.json, preview.log, browser-evidence.json (snapshots/network/action history/download metadata), four inspected screenshots view-1.png through view-4.png, processes-before-cleanup.txt and cleanup.json. Worker records: `/tmp/basics-slot2-s3-grant-1342/` and `/tmp/basics-slot2-s3-shots/`. Preserve the prior S2 failed browser evidence as well.

## Acceptance and remaining gates

G4 local release candidate accepted. Same Sol slot2 may tick only slices 4–5 mechanical completion and record this acceptance in a documentation-only follow-up. All Johan and final-review boxes remain unchecked. Existing slot1 may integrate the accepted tree after slot2 settlement, then perform the remaining authorized S4 skill/artifact audit and checkpoint export without inventing learner facts. Any new heavy command requires a new explicit master grant.

Retain caniuse-lite CC-BY-4.0 data, English model-specific upstream attribution/provenance and dev-only mdn-data CC0 flags. Optional scanned-PDF real browser and separate unmount paths remain explicitly unexercised. No public release, registration, submission, final Astra judging pass, authentication change or conversation-history export is authorized.

Master subsequently confirmed release of heavy-basics-g4-lead-20261018-1348 after independent PID/group/direct-descendant and port checks. The missing native downloaded-payload inspection remains NOT COMPLETED; acceptance uses separately valid S3 export validation and completed lead UI observations, not a claim that this missing inspection occurred.
