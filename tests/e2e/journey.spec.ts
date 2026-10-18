import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ICAL from 'ical.js';
import { execFileSync } from 'node:child_process';
let testStart = 0;
test.beforeEach(({}, info) => { testStart = performance.now(); console.log(JSON.stringify({ event: 'test-start', title: info.title, uptime: execFileSync('uptime', { encoding: 'utf8' }).trim() })); });
test.afterEach(({}, info) => { console.log(JSON.stringify({ event: 'test-end', title: info.title, status: info.status, wallMs: Math.round(performance.now() - testStart), uptime: execFileSync('uptime', { encoding: 'utf8' }).trim() })); });
const origin = 'http://127.0.0.1:4188', key = 'returnwindow.v1.case';
const fixtures = fileURLToPath(new URL('../../fixtures/', import.meta.url));
const screens = fileURLToPath(new URL('../../test-results/screens/', import.meta.url));
const nowURL = '/?today=2026-10-20';
async function screenshot(page: Page, name: string) { await fs.mkdir(screens, { recursive: true }); await page.screenshot({ path: path.join(screens, name), fullPage: false }); }
async function textCase(page: Page, withPolicy = true) {
    await page.goto(nowURL);
    await page.getByRole('textbox', { name: 'Receipt text', exact: true }).fill(await fs.readFile(path.join(fixtures, 'receipts/receipt-demo.txt'), 'utf8'));
    if (withPolicy)
        await page.getByRole('textbox', { name: "Paste the store's policy text", exact: true }).fill(await fs.readFile(path.join(fixtures, 'policies/policy-demo.txt'), 'utf8'));
    await page.getByRole('button', { name: 'See item deadlines', exact: true }).click();
    await expect(page.locator('[data-item]')).toHaveCount(4);
}
const date = (page: Page, n: number) => page.locator(`[data-item="item-${n}"] .date`);
async function delivery(page: Page) { const question = page.getByRole('region', { name: 'Question', exact: true }); await question.getByRole('button', { name: 'Delivery date', exact: true }).click(); await question.getByRole('textbox', { name: 'Delivery date (DD/MM/YYYY)', exact: true }).fill('10/10/2026'); await question.getByRole('button', { name: 'Confirm delivery date', exact: true }).click(); await expect(date(page, 1)).toHaveText('Sat 24 Oct 2026'); }
async function downloadText(page: Page, name: string) { const waiting = page.waitForEvent('download'); await page.getByRole('button', { name, exact: true }).click(); const download = await waiting; const file = await download.path(); if (!file)
    throw new Error('Download was not retained'); return { filename: download.suggestedFilename(), text: await fs.readFile(file, 'utf8') }; }
test('X1 X4 X5 X7 real image → correction → exports, nothing sent, restore and deliberate clear', async ({ page, context }, testInfo) => {
    const requests: string[] = [], workerURLs: string[] = [], errors: string[] = [];
    context.on('request', r => requests.push(r.url()));
    page.on('worker', w => workerURLs.push(w.url()));
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error')
        errors.push(m.text()); });
    let stage = 'start', passed = false;
    try {
        await page.goto(nowURL);
        await expect(page.getByText('Simulated today: Tue 20 Oct 2026')).toBeVisible();
        await screenshot(page, 'X7-start-1280x800.png');
        stage = 'sample';
        await page.getByRole('button', { name: 'Try the sample', exact: true }).click();
        await expect(page.getByRole('progressbar')).toBeVisible();
        await expect(page.locator('[data-item]')).toHaveCount(4, { timeout: 120000 });
        await expect(page.locator('.receipt-preview [data-ocr-box]').first()).toBeVisible();
        const golden = JSON.parse(await fs.readFile(path.join(fixtures, 'receipts/receipt-demo-messy.ocr-golden.json'), 'utf8'));
        expect(golden.lines.find((l: {
            text: string;
        }) => l.text.startsWith('Order date:')).text).toContain('05/10/2026');
        await expect(page.locator('.field').filter({ has: page.getByRole('button', { name: 'Edit Purchase date', exact: true }) })).toContainText('2026-10-05');
        await expect(page.getByText('Check this · Read as day/month (Singapore format)', { exact: true })).toBeVisible();
        await expect(date(page, 2)).toHaveText('Wed 4 Nov 2026');
        await expect(date(page, 3)).toHaveText('Mon 26 Oct 2026');
        await expect(date(page, 4)).toContainText('Not returnable');
        await expect(page.getByRole('region', { name: 'Question', exact: true })).toHaveCount(1);
        await screenshot(page, 'X7-question-1280x800.png');
        await page.getByRole('button', { name: 'View full receipt', exact: true }).click();
        await expect(page.getByRole('dialog', { name: 'Full receipt image' })).toBeVisible();
        await expect(page.locator('dialog .full-receipt img')).toBeVisible();
        await page.getByRole('button', { name: 'Close full receipt', exact: true }).click();
        stage = 'answer-before-correction';
        await delivery(page);
        await page.getByRole('button', { name: 'Edit Purchase date', exact: true }).click();
        await page.getByRole('textbox', { name: 'Purchase date', exact: true }).fill('08/10/2026');
        await page.getByRole('button', { name: 'Save Purchase date', exact: true }).click();
        await expect(date(page, 2)).toHaveText('Sat 7 Nov 2026');
        await expect(date(page, 3)).toHaveText('Thu 29 Oct 2026');
        await expect(date(page, 1)).toHaveText('Sat 24 Oct 2026');
        await page.locator('[data-item="item-2"]').getByRole('button', { name: 'Show passage ①' }).click();
        await expect(page.locator('.policy .flash')).toContainText('30 days');
        stage = 'workspace-viewport';
        await screenshot(page, 'X7-workspace-1280x800.png');
        const actions = await page.locator('.actions').boundingBox(), workspace = await page.locator('.workspace').boundingBox();
        expect(actions).not.toBeNull();
        expect(workspace).not.toBeNull();
        expect(actions!.y).toBeGreaterThanOrEqual(workspace!.y + workspace!.height - 1);
        expect(actions!.y + actions!.height).toBeLessThanOrEqual(800);
        stage = 'calendar';
        const calendar = await downloadText(page, 'Download reminders (.ics)');
        expect(calendar.filename).toBe('returnwindow-juniper-lane-goods-2026-10-08.ics');
        const parsed = new ICAL.Component(ICAL.parse(calendar.text)), events = parsed.getAllSubcomponents('vevent');
        expect(events).toHaveLength(3);
        expect(events.map(e => e.getFirstPropertyValue('dtstart')!.toString())).toEqual(['2026-10-24', '2026-11-07', '2026-10-29']);
        expect(events.map(e => e.getFirstSubcomponent('valarm')!.getFirstPropertyValue('trigger')!.toString())).toEqual(['2026-10-23T01:00:00Z', '2026-11-06T01:00:00Z', '2026-10-28T01:00:00Z']);
        stage = 'evidence';
        await page.getByRole('button', { name: 'Evidence pack', exact: true }).click();
        await expect(page).toHaveURL(/#evidence$/);
        await expect(page.getByRole('heading', { name: 'ReturnWindow evidence pack' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Download .html', exact: true })).toBeEnabled();
        await screenshot(page, 'X7-evidence-1280x800.png');
        const html = await downloadText(page, 'Download .html');
        expect(html.text).toContain('Sample data — synthetic');
        expect(html.text).not.toMatch(/<script[\s>]/i);
        expect(html.text).not.toMatch(/https?:\/\//);
        expect(html.text).toContain('data:image/png;base64,');
        expect(html.text).toContain('05 Oct 2026');
        expect(html.text).toContain('08 Oct 2026');
        await page.emulateMedia({ media: 'print' });
        for (const control of await page.locator('[data-print="hide"]').all())
            await expect(control).toBeHidden();
        await expect(page.locator('.evidence-pack')).toBeVisible();
        await page.emulateMedia({ media: 'screen' });
        await page.getByRole('button', { name: 'Back to workspace', exact: true }).click();
        stage = 'reload';
        await expect.poll(() => page.evaluate(k => { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw).receipt?.purchaseDate.value : null; }, key)).toBe('2026-10-08');
        await page.reload();
        await expect(date(page, 1)).toHaveText('Sat 24 Oct 2026');
        await expect(date(page, 2)).toHaveText('Sat 7 Nov 2026');
        await expect(date(page, 3)).toHaveText('Thu 29 Oct 2026');
        await expect(page.getByText("The receipt image isn't kept after reload; the extracted text and evidence are.", { exact: true })).toBeVisible();
        expect(await page.evaluate(k => localStorage.getItem(k), key)).not.toContain('data:image');
        await expect(page.locator('.receipt-preview img')).toHaveCount(0);
        stage = 'start-over';
        page.once('dialog', d => d.accept());
        await page.getByRole('button', { name: 'Start over', exact: true }).click();
        await expect(page.locator('[data-item]')).toHaveCount(0);
        expect(await page.evaluate(k => localStorage.getItem(k), key)).toBeNull();
        await page.reload();
        await expect(page.getByRole('button', { name: 'Try the sample', exact: true })).toBeVisible();
        await expect(page.locator('[data-item]')).toHaveCount(0);
        expect(await page.evaluate(k => localStorage.getItem(k), key)).toBeNull();
        stage = 'corrupt-save-recovery';
        await page.evaluate(k => localStorage.setItem(k, '{invalid JSON'), key);
        await page.reload();
        await expect(page.getByText("Saved case couldn't be read and was cleared.", { exact: true })).toBeVisible();
        expect(await page.evaluate(k => localStorage.getItem(k), key)).toBeNull();
        stage = 'origin-and-csp';
        expect(requests.filter(url => new URL(url).origin !== origin)).toEqual([]);
        expect(workerURLs.length).toBeGreaterThan(0);
        expect(workerURLs.every(url => new URL(url).origin === origin)).toBe(true);
        expect(requests.some(url => url.endsWith('/ocr/eng.traineddata.gz'))).toBe(true);
        expect(requests.some(url => url.includes('/ocr/tesseract-core-'))).toBe(true);
        expect(errors).toEqual([]);
        expect(await fs.readFile(new URL('../../dist/index.html', import.meta.url), 'utf8')).toContain('http-equiv="Content-Security-Policy"');
        await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', /script-src 'self' 'wasm-unsafe-eval'/);
        passed = true;
        stage = 'complete';
    }
    finally {
        const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content').catch(() => null);
        await fs.mkdir(screens, { recursive: true });
        await fs.writeFile(path.join(screens, 'X4-network.json'), JSON.stringify({ passed, stage, requests, workerURLs, errors, csp }, null, 2));
        if (!passed)
            await page.screenshot({ path: testInfo.outputPath('current-stage.png') }).catch(() => { });
    }
});
test('X2 no policy refuses dates and disables reminders with a reason', async ({ page }) => { await textCase(page, false); await expect(page.getByRole('alert')).toContainText('No policy, no deadline.'); await expect(page.locator('.item .date')).toHaveText(Array(4).fill('No deadline computed.')); await expect(page.getByRole('button', { name: 'Download reminders (.ics)', exact: true })).toBeDisabled(); await expect(page.locator('#export-disabled-reason')).toContainText('supported policy'); });
test('X3 Not sure has only a conditional earliest date and two exported events', async ({ page }) => { await textCase(page); await page.getByRole('button', { name: 'Not sure', exact: true }).click(); await expect(date(page, 1)).toContainText('Earliest possible last day: Thu 22 Oct 2026'); const output = await downloadText(page, 'Download reminders (.ics)'); expect(new ICAL.Component(ICAL.parse(output.text)).getAllSubcomponents('vevent')).toHaveLength(2); });
test('X6 keyboard-only sample and question answer with visible focus', async ({ page }) => { await page.goto(nowURL); const target = page.getByRole('button', { name: 'Try the sample', exact: true }); for (let n = 0; n < 40 && !await target.evaluate(el => el === document.activeElement); n++)
    await page.keyboard.press('Tab'); await expect(target).toBeFocused(); expect(await target.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none'); await page.keyboard.press('Enter'); await expect(page.getByRole('region', { name: 'Question', exact: true })).toBeVisible({ timeout: 120000 }); const purchase = page.getByRole('region', { name: 'Question', exact: true }).getByRole('button', { name: 'Purchase date', exact: true }); for (let n = 0; n < 60 && !await purchase.evaluate(el => el === document.activeElement); n++)
    await page.keyboard.press('Tab'); await expect(purchase).toBeFocused(); await page.keyboard.press('Enter'); await expect(date(page, 1)).toHaveText('Mon 19 Oct 2026'); });
test('X7 mobile390px stacks without horizontal overflow or obstructing action bar', async ({ page }) => { await page.setViewportSize({ width: 390, height: 844 }); await page.goto(nowURL); await screenshot(page, 'X7-start-390x844.png'); await textCase(page); await delivery(page); await screenshot(page, 'X7-workspace-390x844.png'); expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390); expect(await page.locator('.actions').evaluate(el => getComputedStyle(el).position)).toBe('static'); await page.getByRole('button', { name: 'Evidence pack', exact: true }).click(); await screenshot(page, 'X7-evidence-390x844.png'); });
test('input regression: PDF/blank recovery and active-worker cancel/replacement retain S2 lifecycle guarantees', async ({ page, context }) => {
    await context.addInitScript(() => { const urls = new Set<string>(), workers = new Set<Worker>(); Object.assign(window, { __receiptLifecycle: { urls, workers } }); const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL); URL.createObjectURL = value => { const url = create(value); urls.add(url); return url; }; URL.revokeObjectURL = url => { urls.delete(url); revoke(url); }; const NativeWorker = window.Worker; window.Worker = class extends NativeWorker {
        constructor(url: string | URL, options?: WorkerOptions) { super(url, options); workers.add(this); const terminate = this.terminate.bind(this); this.terminate = () => { workers.delete(this); terminate(); }; }
    }; });
    await textCase(page);
    await page.locator('input[data-receipt-file]').setInputFiles(path.join(fixtures, 'receipts/receipt-demo.pdf'));
    await expect(page.locator('[data-item]')).toHaveCount(4);
    await page.locator('.item-details summary').click();
    for (const [n, amount] of [[1, '89.00'], [2, '45.90'], [3, '18.50'], [4, '12.00']])
        await expect(page.locator('.field').filter({ has: page.getByRole('button', { name: `Edit Item ${n} amount (SGD)`, exact: true }) })).toContainText(String(amount));
    await page.locator('input[data-receipt-file]').setInputFiles(path.join(fixtures, 'receipts/blank.png'));
    await expect(page.locator('[data-state="receipt_failed"]')).toBeVisible({ timeout: 120000 });
    await page.getByRole('button', { name: 'Paste the text instead', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Receipt text', exact: true })).toBeVisible();
    await page.locator('input[data-receipt-file]').setInputFiles(path.join(fixtures, 'receipts/blank.png'));
    await expect(page.locator('[data-state="receipt_failed"]')).toBeVisible({ timeout: 120000 });
    await page.getByRole('button', { name: 'Enter details manually', exact: true }).click();
    await page.getByRole('button', { name: 'Add item', exact: true }).click();
    await expect(page.locator('[data-item]')).toHaveCount(1);
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Start over', exact: true }).click();
    await page.getByRole('button', { name: 'Try the sample', exact: true }).click();
    await page.waitForFunction(() => ((window as unknown as {
        __receiptLifecycle: {
            workers: Set<Worker>;
        };
    }).__receiptLifecycle.workers.size) > 0);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.waitForFunction(() => { const l = (window as unknown as {
        __receiptLifecycle: {
            workers: Set<Worker>;
            urls: Set<string>;
        };
    }).__receiptLifecycle; return l.workers.size === 0 && l.urls.size === 0; }, {}, { timeout: 120000 });
    await expect(page.locator('[data-item]')).toHaveCount(0);
    await page.getByRole('button', { name: 'Try the sample', exact: true }).click();
    await page.waitForFunction(() => ((window as unknown as {
        __receiptLifecycle: {
            workers: Set<Worker>;
        };
    }).__receiptLifecycle.workers.size) > 0);
    await page.locator('input[data-receipt-file]').setInputFiles(path.join(fixtures, 'receipts/receipt-demo.txt'));
    await expect(page.locator('[data-item]')).toHaveCount(4);
    await page.waitForFunction(() => { const l = (window as unknown as {
        __receiptLifecycle: {
            workers: Set<Worker>;
            urls: Set<string>;
        };
    }).__receiptLifecycle; return l.workers.size === 0 && l.urls.size === 0; }, {}, { timeout: 120000 });
    await expect(page.getByText('Synthetic sample', { exact: true })).toHaveCount(0);
    await expect(page.locator('.receipt-preview')).toHaveCount(0);
    await expect(date(page, 2)).toHaveText('Sat 7 Nov 2026');
});
