#!/usr/bin/env node
// Probe search on the LIVE docs site the way a visitor uses it.
//
// Check the deployed local index, client assets, result destinations and search modal.
// A green source build cannot detect access controls or stale-HTML asset failures.
//
// Usage: node website/scripts/check-live-search.mjs [--no-browser]
//   DOCS_URL       site to probe (default https://github.com/Garudex-Labs/NoOne/tree/main/website/docs)
//   PLAYWRIGHT_DIR directory holding node_modules/playwright (browser check)
// Exit 0 = search works; exit 1 = broken. Reasons go to stderr and, in
// Actions, to the step summary and `::error::` annotations (alert receivers
// read the annotations off the failed run).

import { appendFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const DOCS_URL = (process.env.DOCS_URL || 'https://github.com/Garudex-Labs/NoOne/tree/main/website/docs').replace(/\/$/, '');
const ORIGIN = new URL(DOCS_URL).origin;
// Terms that must always match many pages; one per major area of the docs.
const QUERIES = ['telegram', 'install', 'skills'];
const MIN_HITS = 5;
// Every request (body included) gets a deadline, and the whole probe gets one,
// so a slow-drip server fails the check with time left to retry and alert
// instead of running into the job's timeout.
const REQUEST_TIMEOUT_MS = 20_000;
const PROBE_DEADLINE_MS = 240_000;
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36 hermes-docs-search-monitor';
// Vercel keeps one cache entry per exact Accept-Encoding string, so a request
// without Chrome's value reads a different copy of the page than visitors do
// (after a deploy it got a 404 for a bundle every browser still loaded).
const ACCEPT_ENCODING = 'gzip, deflate, br, zstd';

const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.error(`FAIL ${msg}`);
  if (process.env.GITHUB_ACTIONS) console.log(`::error title=Docs search::${msg.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')}`);
};
const ok = (msg) => console.log(`ok   ${msg}`);

async function get(url, headers = {}) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, 'accept-encoding': ACCEPT_ENCODING, ...headers },
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return { res, body: await res.text() };
}

// Vercel's firewall/challenge and password protection answer 403/401/429
// with an HTML page of their own; name that instead of "bad status".
function blockedBy(res) {
  if (res.headers.get('x-vercel-mitigated')) return `Vercel firewall (${res.headers.get('x-vercel-mitigated')})`;
  if (res.status === 401) return 'auth wall (401)';
  if (res.status === 403 || res.status === 429) return `HTTP ${res.status}`;
  return null;
}

async function checkExportSearch() {
  const { res, body } = await get(`${DOCS_URL}/`);
  const block = blockedBy(res);
  if (block || !res.ok) {
    fail(`docs page ${DOCS_URL}/ is not reachable for visitors: ${block || `HTTP ${res.status}`}`);
    return [];
  }
  const scripts = [...new Set(Array.from(body.matchAll(/<script[^>]+src="([^"\s]+)"/g), (match) => new URL(match[1].replaceAll('&amp;', '&'), ORIGIN).href))];
  if (!scripts.length) fail('docs page has no client JavaScript');
  await Promise.all(scripts.map(async (url) => {
    const { res } = await get(url);
    if (!res.ok) fail(`deployed client asset returns HTTP ${res.status}: ${url}`);
  }));
  const { res: indexResponse, body: indexBody } = await get(`${DOCS_URL}/_mintlify/search-index.json`);
  if (!indexResponse.ok) {
    fail(`search index returns HTTP ${indexResponse.status}`);
    return [];
  }
  const documents = JSON.parse(indexBody);
  if (!Array.isArray(documents)) throw new Error('search index is not a document array');
  const urls = [];
  for (const query of QUERIES) {
    const matches = documents.filter((document) => `${document.title} ${document.header} ${document.content}`.toLowerCase().includes(query));
    const pages = [...new Set(matches.map((document) => document.page))];
    if (pages.length < MIN_HITS) fail(`query "${query}" matches ${pages.length} pages (< ${MIN_HITS}); search index looks empty`);
    else ok(`query "${query}": ${pages.length} indexed pages`);
    if (pages[0]) {
      const url = new URL(`${DOCS_URL}/${pages[0].replace(/^\//, '')}`);
      if (url.origin !== ORIGIN) fail(`search result points off-site: ${url.href}`);
      else urls.push(url.href);
    }
  }
  return urls;
}

async function checkHitPagesOpen(urls) {
  for (const url of urls) {
    const { res } = await get(url);
    const block = blockedBy(res);
    if (block || !res.ok) fail(`search result ${url} does not open: ${block || `HTTP ${res.status}`}`);
    else ok(`result opens: ${url}`);
  }
}

async function checkBrowser() {
  const require = createRequire(path.join(process.env.PLAYWRIGHT_DIR || process.cwd(), 'noop.js'));
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ userAgent: UA });
    const searchErrors = [];
    page.on('pageerror', (error) => searchErrors.push(error.message));
    await page.goto(`${DOCS_URL}/`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.locator('#search-bar-entry').click({ timeout: 20_000 });
    const dialog = page.getByRole('dialog');
    await dialog.locator('input').first().fill(QUERIES[0], { timeout: 10_000 });
    try {
      await dialog.locator('a[href]').first().waitFor({ timeout: 15_000 });
    } catch {
      const shown = (await dialog.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
      fail(`search modal showed no results for "${QUERIES[0]}" (${searchErrors.join('; ') || 'no client error seen'}; modal: "${shown}")`);
      return;
    }
    ok(`browser: search modal lists ${await dialog.locator('a[href]').count()} results for "${QUERIES[0]}"`);
  } finally {
    await browser.close();
  }
}

async function probe() {
  await checkHitPagesOpen(await checkExportSearch());
  if (!process.argv.includes('--no-browser')) {
    await checkBrowser().catch((e) => fail(`browser check crashed: ${e.message.split('\n')[0]}`));
  }
}

// One exit path for clean failures, thrown errors and the deadline, so the
// alert always carries the real reason.
function finish() {
  if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = failures.length ? failures.map((f) => `- ${f}`) : ['- all checks passed'];
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Docs search (${DOCS_URL})\n${lines.join('\n')}\n`);
  }
  process.exit(failures.length ? 1 : 0);
}

setTimeout(() => {
  fail(`probe did not finish within ${PROBE_DEADLINE_MS / 1000}s`);
  finish();
}, PROBE_DEADLINE_MS).unref();
probe()
  .catch((e) => fail(`probe crashed: ${e.cause?.message || e.message}`))
  .finally(finish);
