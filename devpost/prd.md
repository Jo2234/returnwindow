---
doc: prd
status: approved
---

# ReturnWindow — Product Requirements

Separate return deadlines and quoted evidence for Singapore shoppers with mixed-item receipts. Source: scope.md > Who It's For; The Unique Kernel.

## The Core Journey
Source: scope.md > The Core Loop; What "Working" Looks Like.

1. Add one receipt and the store's policy with a label and copied-on date, or choose **Try the sample**.
2. For a photo, watch on-device reading progress; cancel if needed.
3. Review editable receipt fields beside one result card per item and the highlighted policy.
4. Answer a question only when a governing passage needs a clock start or delivery date. Correct misread fields; affected cards show their previous and new results.
5. Download reminders and open, print or save an evidence pack. Nothing is uploaded.

## Screens and Layout
Source: scope.md > The Core Loop; The POC Boundary.

- **Start:** receipt and policy drop zones, receipt text entry, policy label/copied-on date, **Try the sample**, and “Runs entirely in your browser. Nothing is uploaded. Not legal advice.”
- **Reading receipt:** thumbnail, progress bar, “Reading receipt on this device…” and **Cancel**. Text input skips reading progress.
- **Workspace:** receipt/image and editable extracted fields on the left; question and item cards in the middle; complete policy with numbered highlights on the right. Low-confidence/ambiguous fields say **Check this**. Actions: **Download reminders (.ics)**, **Evidence pack**, **Start over** with confirmation.
- **Evidence pack:** print-friendly page, **Print / Save as PDF** and **Download .html**; controls disappear when printed.

## Look and Feel
Source: scope.md > Inspiration & Identity.

Warm off-white paper, white cards, dark ink and one ink-blue accent. Monospace receipt text, dates and quotations. Green date-set, amber uncertainty, red refusal/closed and grey not-returnable states always include words and numbered passage badges. Quiet change motion, reduced-motion support, visible keyboard focus and readable contrast. System fonts; no stock AI sparkles or gradients. Desktop demonstration at 1280×800; small-screen stacking is P1.

## Features and Behavior

### Receipt and Policy Input
Source: scope.md > The POC Boundary.

Accept PNG/JPG/WebP, text-layer PDF, pasted receipt text or .txt. The user supplies policy text by paste or .txt, plus label and copied-on date. The sample is clearly labelled synthetic and uses the fictional Juniper Lane Goods. Extract store, purchase date, descriptions and amounts; the user can edit them and item categories. Amounts display SGD and do not determine refunds.

### Per-Item Deadlines and Evidence
Source: scope.md > The Unique Kernel.

Each card shows name, editable category, big last-return date, time left or closed status, basis and **Show passage**. The latter reveals the exact governing quotation with a numbered marker. The policy panel shows its label, copied-on date and fingerprint. Never show a computed date without supporting text.

Show this convention in the workspace and evidence pack:

> Dates are calendar dates in Singapore time (Asia/Singapore). The day of purchase or delivery counts as day 0. A 30-day window ends at the end of day 30. 'Days' with no qualifier are treated as calendar days. A one-month window ends on the same date next month, or on the month's last day if that date doesn't exist.

### One Question and Corrections
Source: scope.md > The Unique Kernel; What "Working" Looks Like.

For the sample's ambiguous electronics passage: “This passage says ‘14 days’ but not when the clock starts. Does it start on the purchase date (Thu 8 Oct 2026) or when the order was delivered?” Offer **Purchase date**, **Delivery date** (date entry), **Not sure**. One question covers all items governed by that passage; show only one card at a time. A missing explicitly required delivery date asks “When was your order delivered?”

**Not sure** means no computed date: show the earliest possible last day from purchase, labelled as conditional, and ask the shopper to check with the store. Edits to store, dates, descriptions, amounts, categories and answers recompute results. Changed cards briefly show “was … → now …”; announce the update accessibly and retain a change log.

### Reminders and Evidence Pack
Source: scope.md > The Core Loop.

The calendar file has one all-day event for each computed, unexpired item, with a reminder intended for 09:00 on the day before. Exclude closed, unsure, refused and non-returnable items with reasons; disable reminders when none qualify.

The evidence pack includes item results, exact used passages and character offsets, policy label/copied-on date/full fingerprint, date convention, answers, timestamped changes and the receipt image if available. Include “not legal advice” and a synthetic-sample label where applicable. It is printable and downloadable as a self-contained HTML file.

### Observable Acceptance Criteria
Source: scope.md > What "Working" Looks Like; lead plan §10.2.

- Purchase 8 Oct 2026: shirt **7 Nov 2026** (30 days), mug **29 Oct 2026** (21 days), final-sale scarf **not returnable**, earbuds **waiting for your answer**. Exactly one question.
- Answer delivery **10 Oct 2026**: earbuds **24 Oct 2026**; answer purchase: **22 Oct 2026**; answer Not sure: no computed date, earliest **22 Oct 2026**.
- Correct the real recorded misread purchase **5 Oct → 8 Oct**: shirt **4 Nov → 7 Nov**, mug **26 Oct → 29 Oct**. Answer delivery **10 Oct** before correcting purchase and verify delivery-anchored earbuds stay **24 Oct**. The change log records the correction (decision 10; the earlier 6 Oct target was not obtained).
- No policy: clear refusal, no item dates, reminders disabled. Every displayed deadline links to its verbatim policy passage.
- With the answered delivery sample, reminders contain three events; evidence contains the passages, answers and corrections.

## States and Boundaries
Source: scope.md > Explicitly Cut; The POC Boundary. Detailed limits are engineering recommendations from lead plan §6.

- **Empty:** input areas and sample action remain useful before any data exists.
- **Unreadable receipt:** “We couldn't read enough”; try another image, paste text or enter details manually. No items found: offer manual addition.
- **Bad input:** unsupported format or receipt over 15 MB gets an inline error; policy over 50,000 characters is rejected. Invalid calendar dates or delivery before purchase get an inline correction error.
- **PDF without text:** explain the missing text layer and offer paste; automatic page-one OCR is P1.
- **No policy / no return window:** explicit refusal, no dates. An uncovered item, business-day window or conflicting passages shows the reason without inventing a date. Missing dates ask for them; exclusions say not returnable.
- **Closed:** keep the closed date in the card and evidence; omit from reminders.
- **Reload (P1):** retain this single case without the receipt image; Start over clears it. Unreadable saved data is cleared with a message.

## Product Decisions
- User-supplied policy and refusal rather than guessing preserve the evidence requirement.
- One visible question avoids silently choosing a clock start or overwhelming the shopper.
- Calendar dates in Singapore with day 0 make counting explicit.
- Local-only processing, English and one receipt keep the demonstration bounded.

## What We're Building
The input-to-evidence journey above, including per-item clocks, uncertainty, corrections, refusals, local OCR/text-layer PDF, reminders and printable/downloadable evidence.

## Deferred From the POC
Scanned-PDF OCR, imageless single-case persistence and layout under 720 px are P1 and can be cut before core behavior. A multi-receipt organizer and polished camera capture are outside this build.

## Possible Later Enhancements
Local category suggestions may be explored only after the tested core is complete, without controlling dates. Several saved receipts are a brief-only future idea; they are not part of the frozen MVP.

## Non-Goals
Legal advice or deciding conditions like “unopened”; business-day/holiday counting; refund amounts/fees; policy fetching; accounts, backend, sync, email/SMS; hosted generative models; other languages/currencies; real receipts in fixtures or the demo. These either lack verifiable inputs or expand the proof beyond its core.

## Open Questions
No blocking product questions. Messy OCR reliability is a build investigation, not an assumed success. Johan's personal read-through and hands-on review remain release gates.
