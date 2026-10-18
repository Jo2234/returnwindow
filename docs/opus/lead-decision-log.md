# ReturnWindow (basics): lead decision log

Author: Claude Opus 5.5 HIGH (project lead). The times are SGT.

| When | Decision | Why |
|---|---|---|
| 18 Oct 11:45 | The plan, the answer brief and this log stay outside the repo (`$W/control/plans/basics/`) until the skill pack has generated scope/prd/spec. Then slot 1 copies them to `docs/opus/` | The contest needs an empty starting folder, with the skill install as the first action |
| 18 Oct 11:50 | No generative model in the MVP. On-device Tesseract OCR + deterministic rules. A local LLM category suggester is a P2 stretch behind gate G-LLM | No keys; 8 GB machine shared with DEV (priority); the deterministic core is falsifiable |
| 18 Oct 11:55 | Date convention: Asia/Singapore civil dates, start day = day 0, deadline = start + N calendar days; months clamp to the month's end; business days are refused | One defined, testable convention; refusing business days avoids needing unverifiable holiday data |
| 18 Oct 12:00 | Pins reuse DEV's proven Vite 7.3.7 / Vitest 4.1.12 / TS 6.0.3 / React 19.3.1 / Playwright 1.64.1 (Chromium 1248 already cached) instead of the newest majors | Saves downloads and avoids untested majors on this machine |
| 18 Oct 12:05 | Slot 1 runs the skills by loading the **installed** SKILL.md files and following them as the executing agent. The learner side answers from `skill-pack-answer-brief.md`; personal facts → `[JOHAN]`; approvals delegated and disclosed. No nested agent CLI (that would risk a model substitution) | An honest, genuine use of the skill pack within the authorized workflow |
| 18 Oct 12:05 | Stage 0 works directly in `$W/projects/basics` (main), not a worktree | The repo doesn't exist yet; slot 1 is the integrator |
| 18 Oct 12:05 | Master allocation: 1 active Basics worker → stages run sequentially S0 slot1 → S1 slot2 → S2 slot3 → S3 slot4 → S4 slot1 | USER-RESUME-20261018 allocation |
| 18 Oct 12:10 | G1 passed: scope/prd/spec/checklist are authentic skill outputs consistent with the plan; reconciliation in docs/decisions/plan-vs-spec.md; plan E5 amended | Lead review of 2bf3518..052a085 |
