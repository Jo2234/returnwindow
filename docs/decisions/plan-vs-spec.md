# Plan vs skill-pack spec: reconciliation (gate G1)

**Author:** Claude Opus 5.5 (project lead), 18 Oct 2026 SGT. **Reviewed:** `devpost/scope.md` (2bf3518), `devpost/prd.md` (353c990), `devpost/spec.md` (bdefa9f) and `devpost/checklist.md`, compared with `docs/opus/implementation-plan.md`.

**Rule:** the skill-pack documents are the record. Where the plan says something different, this note decides it, and workers follow this note.

| # | Topic | Plan says | Skill docs say | Decision |
|---|---|---|---|---|
| 1 | Which items go into the .ics | §5.5 E5: ".ics events ⇔ computed items, one-to-one" | PRD/spec: one event per **computed, unexpired** item; closed items are excluded with a reason (also plan §10.6 I3) | **Skill docs win.** E5 now reads: ".ics events ⇔ computed items whose deadline ≥ today, one-to-one; every other item is listed in `excluded` with a reason." |
| 2 | Several saved receipts | §2: a dashboard of many purchases is a non-goal | Scope "Later" / PRD "Possible Later Enhancements": several saved receipts are a future idea outside the frozen MVP | Consistent: it is **not built** in this project. Wording difference only |
| 3 | P1 items (scanned-PDF OCR, persistence, < 720 px layout) | P1, done if time allows, in that order | PRD "Deferred From the POC": P1, can be cut before the core | Consistent. The order of P1 work stays: persistence (slot 4) → scanned-PDF OCR (slot 3, if quick) → < 720 px (slot 4) |
| 4 | Full type contracts | §4 | The spec points to plan §4 instead of repeating it | Accepted: plan §4 is the normative type/API detail under the spec's component headings |
| 5 | Personal fields | — | `[JOHAN: …]` placeholders in scope ("Why This Matters to the Learner") and spec ("personal tooling preferences") | Correct by design; these are release gate 2 (plan §18) |

No other differences were found. The convention text, the acceptance dates, refusals, the one-question rule, pins, ports, CSP and file structure match.

Addendum (from slot 1's Stage 0 report):

| 6 | Days-left example | §6 example "in 16 days" | PRD acceptance: shirt 7 Nov with today 20 Oct = 18 days | Plan example corrected to "in 18 days" (the §10.2 table already says 18) |
| 7 | Run-log wording | — | `docs/process/skill-pack-run-log.md` inventory marks 1-start…4-spec as "Executed (5-build planning only)" | Wording slip: 1-start to 4-spec were executed fully, and only 5-build stopped after planning. Slot 1 corrects it in Stage S4 |
