## Inspiration

A receipt gives you one purchase date, but a mixed basket can have several return clocks. Clothing might have 30 days from purchase, electronics might need a delivery date, and a clearance item might be final sale. A single reminder loses those distinctions.

ReturnWindow is a small, local tool for shoppers who want to understand each item's deadline and keep the policy passage behind it.

## What it does

Add a receipt photo, PDF or pasted text, then supply the store's English return policy. ReturnWindow reads the receipt locally, matches supported rules to individual items, and shows each deadline beside its evidence. When the start of a window is ambiguous, it asks one question. When a rule is missing, unsupported or conflicting, it refuses to guess.

The demo follows a synthetic four-item receipt. OCR reads the purchase date as 5 October instead of 8 October. After answering that the earbuds were delivered on 10 October, correcting the purchase date moves the shirt from 4 to 7 November and the mug from 26 to 29 October. The earbuds stay on 24 October because their clock depends on delivery. The final-sale scarf gets no invented deadline.

Export eligible deadlines as a calendar file, with reminders for 09:00 Singapore time on the preceding day. Download a self-contained HTML evidence pack with results, policy quotations, answers and the correction history. Reload restores one local case without retaining the receipt image; Start over clears it.

## How it was built

The project started from an empty folder during this hackathon. The Devpost Learn Skill Pack generated the scope, PRD, specification and build checklist before implementation. Those original documents are in the repository's `devpost/` folder.

React and TypeScript provide the interface; Tesseract.js performs local OCR and PDF.js extracts PDF text. Deterministic parsing and calendar-date rules compute deadlines, with Zod validating saved cases. The app has no backend, receipt-upload service or required API key. A generative model does not decide the return dates.

Development used Claude Opus for the original plan and reviews, GPT-6 Astra for later reviews, and GPT-6.1 Sol for implementation and testing. The repository retains the real development history and distinguishes agent work from personal activity. React, Tesseract, PDF.js and other dependencies are credited with their licences.

## Challenges and what I learned

The main lesson from this build was to make uncertainty reviewable instead of hiding it. OCR output is a proposal, not a fact. Keeping the source visible, the fields editable and the rule explicit makes a mistake recoverable.

Testing also needs to distinguish a plausible wrong answer from the right one. Checking that every deadline moved three days would have missed the bug that matters here: a purchase correction must leave a delivery-based deadline unchanged. Calendar exports needed the same precision—an all-day event's relative alarm does not reliably express 09:00 Singapore time, so the export uses explicit alarm instants.

## What works today

The accepted core passed 131 unit tests, 49 date/engine tests in each of three timezones, 13 OCR/adapter checks and six production browser tests. The demo preparation also exercised actual local OCR, date correction, calendar/evidence downloads, reload and clear on the local production build. Detailed results and limitations stay in the repository; these fixture checks are not a claim about general OCR accuracy or real-world user outcomes.

## What's next

Broader policy wording, consented receipt testing and more date conventions are useful next steps. Today's proof of concept uses a bounded English-policy grammar and Singapore calendar dates. It does not determine legal rights or whether an item satisfies every return condition. Users must review the receipt and policy before relying on a date.

The demo uses synthetic data and a visible simulated date. Narration is generated with OpenAI's Cedar voice and is not a recording of my voice.
