# S3 source review — ready for reserved validation

Reviewer: GPT-6 Astra HIGH, quota-fallback specification/review lead, 18 October 2026. Implementation: existing GPT-6.1 Sol HIGH slot2, thread 799a8508-1724-429f-bcaf-1b1ed7324dfe. Original Opus plan authorship retained.

Reviewed clean commit `b702e4fe5deb639185dea3ea6ff891029aff0aac` on `codex/slot2-exports-polish`, based on accepted main `e8d603c17087e6a236c6ea61f51a447b204e8bd9`. No blocking source finding remains for the requested validation batch. This is source readiness, not G4 acceptance or permission to execute without a master grant.

Reviewed calendar/evidence/persistence modules, store integration, export controls, receipt dialog and responsive styling, independent unit expectations, Playwright configuration and six-case journey harness. Absolute UTC alarms preserve DATE events, omit RELATED, and use independently asserted preceding-day 09:00 SGT instants including the year boundary. Stored store text remains verbatim. Evidence text is escaped, raster images are restricted to allowed data URLs, and the generated document has no script or external resource requirement. Persistence is schema-validated and imageless; reset clears storage immediately and cancels a queued save. Desktop columns have bounded scroll areas and actions remain in document flow; mobile stacks the panels.

The E2E source retains actual messy 05 October and purchase correction to 08 October, the pre/post shirt and mug dates, and the 24 October delivery-based invariant. It exercises exports, reload/reset/corrupt storage, keyboard interaction, mobile layout, origin checks, and prior S2 PDF/failure/cancellation/replacement paths. Geometry, console/network behavior and screenshot quality remain runtime questions.

Pinned files:
- tests/e2e/journey.spec.ts: d6a7ec3f6b743c7d5e096d9a1f7a7a2595953825cf1a65c4f226ab1d79c604d1
- playwright.config.ts: df0a7a8472d9ad032a956325a65a99f270b8d2dad47d185b68eb7adb4259ed33

Ready request, once sequentially and stop at first command failure: pnpm install --frozen-lockfile; pnpm typecheck; pnpm test; pnpm test:tz; pnpm test:ocr; pnpm test:e2e. The last command includes its configured pnpm build then loopback preview on 4188. One Chromium worker, six serial cases, maxFailures=1, retries=0. Estimate 180 seconds; report overrun without inferred expiry. No fixture rendering or extra browser/server. No heavy execution occurred during this source review.

Worker-reported targeted checks: ICS 5, evidence 5, persistence 8 and typecheck passed. Full-suite counts 131 unit, 3×49 timezone, 13 OCR/adapter and 6 E2E are predictions only. G4, slices 4–5, all Johan hands-on/final gates and merge remain pending. Existing licence/model provenance flags and optional unexercised scanned-PDF/separate-unmount paths remain recorded. G4 additionally requires lead browser walkthrough at 1280×800 under a separately named master reservation.

## Automated validation evidence reviewed

Grant heavy-basics-s3-slot2-20261018-1342 ran all six commands once, 05:43:38–05:44:18Z, all exit 0. Lead read raw status and test logs: 131 unit, 49 in each of three timezones, 13 OCR/adapter and six E2E cases passed. Configured production build passed; upstream Zod annotation and color-environment warnings are retained. X4 network evidence reports complete/pass, 20 same-origin requests including blobs, one local OCR worker URL, local core/model assets, exact CSP and no errors. Lead independently found all 27 reported PIDs and seven process groups absent, port 4188 clear. Master release is separate.

All seven saved screenshots were visually inspected. Desktop workspace and action geometry address the G3 issue; mobile panels stack without horizontal clipping in the reviewed images. The evidence table's final column wraps tightly, particularly on mobile; inspect readability in the lead walkthrough. No implementation change requested from screenshots alone. G4 remains pending the separately reserved lead walkthrough, and slices 4–5 remain unchecked.
