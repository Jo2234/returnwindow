# ReturnWindow G2 checkpoint

Recorded by GPT-6 Astra HIGH (quota-fallback lead), 18 October 2026.

Tested commit: `40aa504664afbf920f8a584237c4a44595f3318d`. G2 approval belongs to the preceding Claude Opus 5.5 HIGH review at `9ad61f54792a51aa3036db3111ad27b9d56958a0`; the merge has identical tree content. This checkpoint adds documentation only.

Implemented: deterministic civil-date arithmetic, receipt/policy parsing, evidence spans, matching, ambiguity questions, refusals, corrections, and the functional paste-text UI. Genuine skill-pack planning is recorded in `devpost/` and `docs/process/skill-pack-run-log.md`.

Verification from Sol slot 1's completed merge report:

- `pnpm install --frozen-lockfile`: pass.
- `pnpm typecheck`: pass.
- `pnpm test`: 113/113, 7 files.
- `pnpm test:tz`: 49/49 each in UTC, America/Los_Angeles, Pacific/Kiritimati.
- `git status --short`: clean after merge.

These checks ran before adoption of the new master reservation protocol. No new full suite, build or E2E is claimed here. The prior S1 build/browser evidence is for ancestor `8c9a6c9`, not this merged checkpoint.

Remaining: S2 real local OCR/PDF/assets/fixtures, then S3 calendar/evidence exports, persistence, visual polish and full browser verification; S4 final audit. No live sponsor APIs exist in this project. Public deployment, public repository, registration and submission have not been performed. Learner personal facts, hands-on review, description/reflection and video remain Johan's.

History review found no credential-shaped strings; keyword hits are parser token names, lockfile package names, and planning/skill privacy instructions. The actual `devpost/learner-profile.md` is not tracked; installed learner-profile templates are public skill material. Build/dependency/OCR caches are excluded. Private relay upload and main-Mac file transfer must be verified separately.
