---
title: "Stocks — Stock quotes, history, search, compare, crypto via Yahoo"
sidebarTitle: "Stocks"
description: "Stock quotes, history, search, compare, crypto via Yahoo"
---

{/* This page is auto-generated from the skill's SKILL.md by website/scripts/generate-skill-docs.py. Edit the source SKILL.md, not this page. */}

# Stocks {#stocks}

Stock quotes, history, search, compare, crypto via Yahoo.

## Skill metadata {#skill-metadata}

| | |
|---|---|
| Source | Optional — install with `noone skills install official/finance/stocks` |
| Path | `optional-skills/finance/stocks` |
| Version | `0.1.0` |
| Author | RAWx18 |
| License | MIT |
| Platforms | linux, macos, windows |
| Tags | `Stocks`, `Finance`, `Market`, `Crypto`, `Investing` |
| Related skills | [`dcf-model`](../../optional/finance/finance-dcf-model.md), [`comps-analysis`](../../optional/finance/finance-comps-analysis.md), [`lbo-model`](../../optional/finance/finance-lbo-model.md) |

## Reference: full SKILL.md {#reference-full-skillmd}

<Info>

<div className="doc-callout-title">

INFO

</div>

The following is the complete skill definition that {{app-name}} loads when this skill is triggered. This is what the agent sees as instructions when the skill is active.

</Info>

# Stocks Skill {#stocks-skill}

Read-only market data via Yahoo Finance. Five commands: `quote`, `search`,
`history`, `compare`, `crypto`. Python stdlib only — no API key, no pip
installs. Yahoo's endpoint is unofficial and may rate-limit or change.

## When to Use {#when-to-use}

- User asks for a current stock price (AAPL, TSLA, MSFT, ...)
- User wants to look up a ticker by company name
- User wants OHLCV history or performance over a date range
- User wants to compare several tickers side by side
- User asks for a crypto price (BTC, ETH, SOL, ...)

## Prerequisites {#prerequisites}

Python 3.8+ stdlib only. Optional: set `ALPHA_VANTAGE_KEY` to enrich
`market_cap`, `pe_ratio`, and 52-week levels when Yahoo's crumb-protected
fields come back null. Free key: https://www.alphavantage.co/support/#api-key

## How to Run {#how-to-run}

Invoke through the `terminal` tool. Once installed:

```
SCRIPT=~/.hermes/skills/finance/stocks/scripts/stocks_client.py
python $SCRIPT quote AAPL
```

All output is JSON on stdout — pipe through `jq` if you want to slice it.

## Quick Reference {#quick-reference}

```
python $SCRIPT quote AAPL
python $SCRIPT quote AAPL MSFT GOOGL TSLA
python $SCRIPT search "Tesla"
python $SCRIPT history NVDA --range 6mo
python $SCRIPT compare AAPL MSFT GOOGL
python $SCRIPT crypto BTC ETH SOL
```

## Commands {#commands}

### `quote SYMBOL [SYMBOL2 ...]` {#quote-symbol-symbol2-}

Current price, change, change%, volume, 52-week high/low.

### `search QUERY` {#search-query}

Find tickers by company name. Returns top 5: symbol, name, exchange, type.

### `history SYMBOL [--range RANGE]` {#history-symbol---range-range}

Daily OHLCV plus stats (min, max, avg, total return %). Ranges: `1mo`,
`3mo`, `6mo`, `1y`, `5y`. Default: `1mo`.

### `compare SYMBOL1 SYMBOL2 [...]` {#compare-symbol1-symbol2-}

Side-by-side: price, change%, 52-week performance.

### `crypto SYMBOL [SYMBOL2 ...]` {#crypto-symbol-symbol2-}

Crypto prices. Pass `BTC` (the script appends `-USD` automatically).

## Pitfalls {#pitfalls}

- Yahoo Finance's API is unofficial. Endpoints can change or rate-limit
  without notice — if requests start failing, that's why.
- `market_cap` and `pe_ratio` may return null on `quote` when Yahoo's
  crumb session isn't established. Set `ALPHA_VANTAGE_KEY` to backfill.
- Add a small delay between bulk requests to avoid rate-limiting.
- This is read-only — no order placement, no account integration.

## Verification {#verification}

```
python ~/.hermes/skills/finance/stocks/scripts/stocks_client.py quote AAPL
```

Returns a JSON object with `symbol: "AAPL"` and a numeric `price` field.
