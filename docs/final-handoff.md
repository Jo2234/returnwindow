# ReturnWindow — G4 integration and S4 technical handoff

Prepared 2026-10-18 13:55:42 SGT by original GPT-6.1 Sol HIGH slot1. Status: **G4 local release candidate accepted; S4 technical artifacts prepared; human completion and release pending**. No final judging approval.

## Exact integration provenance

- Original main: e8d603c17087e6a236c6ea61f51a447b204e8bd9.
- Tested application: b702e4fe5deb639185dea3ea6ff891029aff0aac.
- Astra G4 accepted source/evidence: 32359b97d55169ab591120517bf03f062dec93d6.
- Final reviewed checklist-only input: 94d1986b23afe177720471a8baa33eb949eaaa59; only devpost/checklist.md differs from32359b9.
- Conflict-free no-ff main merge: 84e00be46f096e5bb8cb2df512c2e106e94c9a11. Before any S4 edit, `git diff --exit-code 94d1986b23afe177720471a8baa33eb949eaaa59 HEAD` exited0. Tested→approved changes are exactly README.md, devpost/checklist.md, docs/demo-script.md, docs/submission-facts.md and docs/test-report.md. No app/test/style/lock change is introduced by S4.
- The subsequent S4 commit contains intended documentation and devpost/app-map.html only. Its final SHA is in the worker report / git log; this file avoids a self-referential commit ID.

Original plan/G1/G2: Claude Opus 5.5 HIGH. G3/G4/reconciliations: GPT-6 Astra HIGH, authorized quota fallback, specification/review only. Application/tests: existing GPT-6.1 Sol HIGH slot2. Integration/artifact audit: original Sol HIGH slot1. Delegated approvals and Johan personal-review gates remain disclosed.

## Accepted checks, not rerun in S4

[Source review](checkpoints/s3-source-review.md), [G4 acceptance](checkpoints/g4-review.md) and [test report](test-report.md) retain exact provenance. S3 grant `heavy-basics-s3-slot2-20261018-1342`: frozen install, typecheck, 131 unit, 3×49 timezone, 13 OCR/adapter and six E2E cases passed; E2E included the production build. Lead grant `heavy-basics-g4-lead-20261018-1348`: one production preview/native T3 tab exercised the real image, delivery answer, correction, evidence/download UI, imageless restore and deliberate clear. Master released both after cleanup. No grant exists for S4 heavy execution; none was started.

Native G4 download metadata succeeded (ICS 3031 B / HTML 473344 B), but the lead closed the tab before retaining the temporary paths. Native payload read: **NOT COMPLETED**. No retained native payload copies are claimed. Acceptance relies separately on the passing reserved S3 actual downloaded-file reads, independent ical.js/HTML assertions and print-emulation checks plus the completed live G4 UI walkthrough. No assertion was waived, and no redundant browser rerun was performed.

Retained original evidence remains on RP:

- /tmp/basics-g4-lead-walkthrough/ — browser-evidence.json, cleanup.json, start.json, preview.log and four screenshots.
- /tmp/basics-slot2-s3-grant-1342/ — status.log and 1–6.log.
- /tmp/basics-slot2-s3-shots/ — seven viewport screenshots and X4-network.json (passed/stage complete,20 requests, no errors).
- Earlier S2 failed browser evidence remains untouched. No missing evidence has been recreated.

## S4 artifacts

- [App map](../devpost/app-map.html): actual three-stop purchase-correction/result/persistence route, source snapshot, change pointers and reusable falsifying-test example. Reference only; not toured/shown to Johan. Agent native visual review [passed19Oct](process/appmap-visual-review-20261019.md) under released grant0858; Johan viewing remains pending.
- [Skill execution note](process/s4-skill-run-log.md): actual installed 5-build/code-tour and 6-ship technical preparation; human route/optional reflection/final review remain pending.
- [Audit](process/s4-audit.md): full reachable-history/metadata/synthetic/license review, methods/counts and limits; no destructive cleanup.
- [Technical video checklist](video-checklist.md): accepted choreography and exact05→08 evidence, no written narration.
- Lead source records are copied unchanged into docs/checkpoints, docs/opus and docs/decisions; originals remain in control/plans/basics.

## Current behavior and limitations

Actual synthetic purchase OCR05 Oct, ground truth08 Oct. Delivery10 Oct before correction gives earbuds24 Oct; purchase correction moves shirt04→07 Nov and mug26→29 Oct only. Evidence quotes verified policy passages; unsupported/missing/conflicting rules refuse dates. Absolute alarms encode09:00 SGT on the preceding day; Calendar-client import remains unverified by Johan. Imageless reload restores the saved case; Start over clears it and cannot be undone by reload.

Optional scanned-PDF browser and separate browser-unmount scenarios remain unexercised. The evidence table's final column wraps narrowly at 390px; accepted as a minor visual limitation, not silently fixed. The former model-specific chain is now substantiated by pinned content identity and official Apache-2.0 licensing; [source notices](../THIRD_PARTY_NOTICES.md) preserve distinct package MIT and model/data terms. A generated static notice-pair copy remains proposed; no legal clearance. No sponsor API.

## Outstanding Johan gates

Personal scope/PRD/spec review and facts; all hands-on checkpoints; final kick-the-tires feedback and explicit readiness; actual learning activity with optional edit/reflection; seeing the app map; Calendar import and real print/PDF review; learner-written project name/description/reflections/survey; narration/video; explicit public-repository/release authorization; registration/submission. No final Astra judging pass.

Installed skills do not authorize claiming full 5-build, learning-wrap-up or 6-ship completion while these are pending. S4 preparation does not satisfy them.

## Delivery boundary

No push, bundle export, publication, authentication change or conversation-history copy in this assignment. Lead reviews the final documentation head before exporting the tested checkpoint. No other worktree, branch, job or worker history is removed or modified.

## 19 Oct resume amendments

Agent native app-map visual validation passed on 19 Oct 2026 under heavy-basics-appmap-lead-20261019-0858 (master CLOSED/RELEASED PASS): desktop1280×800/mobile390×844, three retained screenshots, same-document navigation/details and keyboard focus, no overflow. Reviewed artifact SHA-2563cfd682f37da5c86229c854dd0be0f8086a4774a6efc5c92056fcf713035a1dc at source6b5a58d. Native network/console arrays were empty; server log records one local GET, so this is not exhaustive document-request capture. No remote request was observed. Johan viewing/learning/final review remains pending. New factual map text was not re-rendered; CSS/tag/attribute structure is unchanged, as specifically authorized. [Model/data investigation](notices/provenance-investigation-20261019.md) records exact hashes/revisions and attribution, with no model/fixture/lock replacement. Private [release notes](delivery-20261019/release-notes.md), [storyboard](delivery-20261019/demo-storyboard.md) and [submission draft](delivery-20261019/submission-draft.md) retain lead authorship and personal placeholders. Slot2 evidence-table work has not been integrated by slot1; its source/check acceptance must be coordinated with the lead. The S3 accepted checks and G4 missing native payload-read limitation above are unchanged.
