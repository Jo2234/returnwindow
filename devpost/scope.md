---
doc: scope
status: approved
---

# ReturnWindow

A personal return-deadline and evidence organizer: a separate last-return day for each item, backed by the store's own policy line.

## The Unique Kernel
Separate return clocks per item on one receipt, each backed by the exact highlighted sentence from the supplied policy. If the clock start is ambiguous, ask one question; if no policy line supports a date, refuse to guess.

## Who It's For
Shoppers in Singapore buying several kinds of item in one online or in-store transaction. They keep receipts, but today read the returns page and count days themselves—or check too late. A headline like “30-day returns” can hide a shorter electronics clock or a final-sale exclusion.

## The Core Loop
Open it, add one receipt and the policy, see each item's date and passage, answer the question if needed, and correct anything misread. Every deadline recomputes. Download reminders and an evidence pack. Return with the next receipt that matters.

## Inspiration & Identity
Calm and trustworthy: tidy receipt paper and ink, monospace receipt text and dates, clear status words and numbered passage markers. No external visual references were supplied.

## Why This Matters to the Learner
Not established — [JOHAN: personal stake, in his own words].

## What "Working" Looks Like
A synthetic four-item receipt from Juniper Lane Goods produces a 30-day shirt date, a 21-day default mug date, a not-returnable final-sale scarf, and earbuds waiting on one question about their 14-day clock. Correcting the purchase date visibly changes the affected cards; answering with delivery supplies the earbuds' date. Each card points to the exact policy sentence. Download a calendar file and printable evidence page. The correction rippling through the cards is the demonstration's central moment.

## The POC Boundary
One receipt and one supplied policy at a time. Image, text-layer PDF or text receipt; pasted/text-file policy; per-item dates; one-question uncertainty; editable extraction with recompute and a change log; refusals; .ics reminders and printable evidence. Entirely in the browser, English, Singapore calendar dates. No generative model computes deadlines.

## Later
Scanned PDFs, several saved receipts, mobile camera capture polish and optional local-model category suggestions. Saving several receipts is a future idea, outside the frozen MVP.

## Explicitly Cut
- Legal advice and interpreting conditions such as “unopened”: show the passage for the shopper to assess.
- Business-day and holiday counting: no unverifiable calendar assumptions; say “not computed.”
- Fetching policy pages: the user supplies the text, so store rules are never guessed.
- Accounts, servers, sync and email/SMS: nothing leaves the device; reminders use .ics.
- Refund amounts, fees, other languages and currencies: keep the experiment focused on English policy clocks and SGD display.
