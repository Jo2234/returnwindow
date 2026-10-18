# Skill-pack answer brief: ReturnWindow (project `basics`)

**What this is:** the source the slot-1 agent uses to answer the Devpost Learn Skill Pack's interview questions on Johan's behalf. Johan authorized this workflow, and the product idea was selected and accepted on 16 Oct 2026 (`$W/projects/dev/docs/decisions/joint-decisions-accepted.md` §2 + `consensus-acceptance.md`). Author: Claude Opus 5.5 (project lead), 18 Oct 2026. The engineering detail is in `implementation-plan.md` (same folder).

**Honesty rules (non-negotiable):**
1. Answer **product, design and technical** questions from this brief, close to its wording. If a question isn't covered, give the most conservative answer consistent with the plan and mark it `(agent inference from plan §x)` in the run log.
2. **Personal facts about Johan** stay `[JOHAN: …]` placeholders: his experience, his personal stake, what he wants to learn, who he personally knows with this problem, real usage, and his reflections. Where the template needs a value, use `not established — [JOHAN: to confirm]`. Never invent them.
3. The skills say "never invent the learner's intentions". The intentions here are the **accepted project decision**. Each answer in the run log cites its brief section, so a reader can see the source.
4. **Approvals:** when a displayed draft matches this brief and the plan, reply "Looks good" on Johan's behalf **under his delegated authorization**, and record that in the run log as `approval: delegated (agent, per Johan's 16–18 Oct authorization); Johan personal review pending (release gate)`. If a draft contradicts the brief, request changes through the skill flow.
5. Never use multiple-choice tools. Answer free-form, the way a learner would.

---

## 1-start

- **Q1 What would you like to build?** "ReturnWindow: a personal return-deadline and evidence organizer. You drop in a receipt (a photo, a PDF or text) plus the store's own return-policy text. It pulls out the purchase date, store and line items, works out a separate last-return day for each item from the exact policy line that applies, highlights that line, and asks one question when the policy doesn't say whether the clock starts at purchase or delivery. You can correct anything it misread and every deadline recomputes. Then you export calendar reminders (.ics) and a printable evidence pack. It never guesses a policy that wasn't supplied." (brief §A)
- **Q2 Experience with coding / AI agents / plan-first?** `[JOHAN: coding and agent experience — not established]`. Factual context that can be stated: this project is being built in a plan-first workflow with AI coding agents; a separate planning lead wrote a technical plan before any code. Pacing preference (a process choice, not a personal fact): **concise explanations, small batches of 2–3 related questions are fine.**
- **Q3 One thing to get better at?** `[JOHAN: personal learning goal — not established]`. Leave it open, as the skill allows.
- **Optional get-to-know-you:** decline politely ("Let's keep going").
- **Review Format (asked in 2-scope):** markdown.

## A. Scope (2-scope)

- **Brain dump:** use the Q1 answer plus the following. Why per item: one receipt can hold items under different rules (e.g. apparel 30 days, electronics 14 days, final-sale items not returnable at all), and the clock can start at purchase or delivery. People usually see one "30-day returns" headline and miss the item that has a shorter clock. If a refund is disputed, having the exact policy line and the date logic written down helps.
- **Who it's for (product audience):** shoppers in Singapore who buy several kinds of things in one transaction, online or in-store, keep e-receipts or paper receipts, and want to know for each item whether, and until when, they can return it. Today they read the store's returns page and count days in their head, or don't check until it's too late. (Johan's personal connection: `[JOHAN: optional personal story]`.)
- **The Unique Kernel:** "Separate return clocks per item on one receipt, each backed by the exact highlighted sentence from the store's own policy, plus an honest 'uncertain' state that asks exactly one question when the policy doesn't say when the clock starts, and a refusal when there's no policy line to back a date."
- **Core loop:** open it → drop the receipt and paste the policy → see a card per item with its last day and its passage → answer the one question if asked → fix anything it misread (every deadline updates) → download reminders / evidence pack. People come back with each new receipt that matters (bigger purchases, gifts, online orders).
- **Inspiration and identity:** calm and trustworthy, like a tidy paper receipt and ink, not a flashy AI app. Monospace for receipt text and dates; clear status colours with numbered passage markers. No URLs to cite.
- **Why this matters to the learner:** `[JOHAN: personal stake, in his own words]`.
- **What "working" looks like:** "With the sample receipt (four items from one fictional shop) and its policy, I see four different results: a shirt with a 30-day date, a mug on the 21-day default, a final-sale scarf marked not returnable, and earbuds waiting on one question because the policy says '14 days' without saying from when. I fix the misread purchase date and the dates visibly change. I answer the question, and the earbuds get a date too. I download a calendar file and a printable evidence page. The 'oh that's cool' moment: correcting one date ripples through every card, and each card points at the exact sentence in the policy."
- **POC boundary (now):** one receipt and one policy at a time; image/PDF/text receipt; pasted policy; per-item deadlines; one-question uncertainty; corrections with recompute; refusals; .ics + printable evidence; runs fully in the browser; English; Singapore dates.
- **Later:** PDFs that are only scans; saving several receipts; mobile camera capture polish; optional local AI model to suggest item categories.
- **Explicitly cut:** legal advice or interpreting conditions like "unopened" (we show the sentence and the user decides); business-day counting and holiday calendars (they need data we can't verify, so we say "not computed"); fetching policies from the web (the user must supply the policy, because guessing store rules is exactly what we won't do); accounts, servers, email/SMS reminders (privacy: nothing leaves the device); refund amounts and fees; other languages and currencies.

## B. PRD (3-prd)

- **Project name:** ReturnWindow.
- **Screens:** (1) the start screen: two drop zones (receipt; store policy with a label and "copied on" date), a **Try the sample** button, and the privacy line "Runs entirely in your browser. Nothing is uploaded. Not legal advice." (2) "Reading receipt…" with a progress bar and Cancel. (3) the workspace: receipt on the left (image with boxes around what was read + editable fields, "Check this" on low-confidence fields), deadline cards in the middle (question card on top when needed), and the policy text on the right with numbered highlights. (4) the evidence-pack page for print/save.
- **Each card shows:** the item name, category (changeable), the last day as a big date ("Sat 7 Nov 2026"), how long is left ("in 18 days" / "Last day today" / "Closed 2 days ago"), the basis ("30 days from purchase (Thu 8 Oct 2026) · passage ①"), and **Show passage**. Cards without a date say why, in plain words (waiting for your answer / not returnable / no policy line covers this item / business days not computed / two passages disagree / add the date).
- **The question:** "This passage says '14 days' but not when the clock starts. Does it start on the purchase date (Thu 8 Oct 2026) or when the order was delivered?" Buttons: Purchase date · Delivery date (then a date box) · Not sure. With "Not sure", the card says "Not computed. Earliest possible last day: … (if counted from purchase). Check with the store." Only one question card at a time; one question covers every item under that passage.
- **Corrections:** any field can be edited. After a change every deadline recomputes, and changed cards briefly show "was … → now …". Everything is kept in a change log that goes into the evidence pack.
- **Date rule (product wording):** "Dates are calendar dates in Singapore time. The day of purchase or delivery is day 0, so a 30-day window ends at the end of day 30. 'Days' means calendar days. One month means the same date next month (or the month's last day)."
- **Acceptance criteria:** use plan §10.2's demo table (shirt 7 Nov, mug 29 Oct, scarf not returnable, earbuds needs answer → 24 Oct after delivery 10 Oct; misread 06/10 shows 5 Nov/27 Oct and changes on correction; the delivery-based earbuds date does not change when the purchase date is fixed). With no policy: no dates at all and a clear refusal. Calendar file: one reminder per item with a date, the day before at 9 am. The evidence page quotes each passage exactly, with the change log and "not legal advice".
- **Edge cases:** unreadable photo → "We couldn't read enough" with options to try another image, paste the text, or type the details; no policy → refusal; a policy without a return window → refusal; delivery date before purchase → inline error; a deadline already passed → "Closed on …" and not in the calendar file; wrong file type / too big → message.
- **Look and Feel (the 1–2 design questions):** "Receipt paper and ink: warm off-white background, white cards, dark ink text, one ink-blue accent. Monospace for receipt text, dates and quoted passages. Status colours (green = date set, amber = needs your answer, red = refused/closed, grey = not returnable), always with words and numbered passage badges so colour isn't the only signal. Quiet motion only when deadlines change. No stock AI sparkles or gradients."
- **Product decisions:** the user always supplies the policy; one question at a time; refuse rather than guess; Singapore calendar-date convention; local-only; English.
- **Deferred / non-goals:** as in scope "Later" / "Explicitly cut".
- **Open questions:** none blocking. (Johan's personal review is a release gate, not an open product question.)

## C. Spec (4-spec)

Answer from `implementation-plan.md` §§3–13. Key choices to state and agree to:
- **Where it runs:** a local web app in the browser (Vite + React + TypeScript), started with `pnpm install` then `pnpm dev`, then open http://127.0.0.1:5188. No server, no deployment needed; the video is recorded locally. (Optional deployment: not planned.)
- **Stack:** React 19 + Vite 7 + TypeScript 6; pnpm; Vitest + fast-check for tests; Playwright for end-to-end checks and for rendering the synthetic receipt images; tesseract.js 7 (on-device OCR, English) with self-hosted model files; pdf.js for PDFs; ical.js only in tests to check the calendar file with an independent parser; zod for validating saved state. Exact pins are in plan §12.
- **Components:** the plan §3/§4 modules (civil-date, spans, categories, policy parser, receipt parser, matcher, engine, questions, corrections, ics, evidence, persist, OCR adapter, PDF adapter, input router, case store, UI).
- **Data model:** plan §4.1 (CaseState as the single source of truth; everything else is derived).
- **Failure modes:** plan §6 table + §5 refusals.
- **Simplified and why:** no LLM in the MVP (the deterministic core is testable and honest); business days not computed; no backend; persistence without the image.
- **One useful unknown (required by 4-spec):** "How reliable is on-device OCR on a messy receipt photo, and how do we stop a misread from silently producing a wrong deadline?" Clarified by: per-field confidence + 'Check this' flags + one-tap correction with visible recompute; checked during the build by real OCR tests on a synthetic messy receipt whose actual output is recorded (plan §10.5).
- **Learner's technical preferences:** `[JOHAN: personal tooling preferences — not established]`; agreed recommendation: the stack above, chosen because it runs fully offline on an 8 GB Intel Mac and keeps the core logic testable without any AI service.

## D. 5-build (plan only in Stage 0)

- **Build mode:** fast (verification and commits stay; fewer explanations). The learner hands-on checkpoints are **Johan's**. The agent performs and records mechanical checks and agent-side browser checks, but leaves each learner-check box unticked with `[JOHAN: hands-on check pending]`, unless the lead later records Johan's actual feedback.
- **Slices:** expect plan §15.1. Approve the order if it matches (kernel first).
- **Discord suggestion after slice 1:** don't post (no organizer or community messages in this workflow). Note it as a Johan option.

## E. 6-ship (later, prep only)

The agent may audit the repo, list the video checklist and identify gaps. **Johan** writes the project name/description/"what I learned" and any posts, and makes the repo public; the agent only fixes spelling if asked. No submission by agents.
