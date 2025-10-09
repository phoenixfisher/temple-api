# 🕍 Temple API

A lightweight, public API for LDS temple data — locations, status, and key details — built and served on **Cloudflare Workers**.

This API powers the [TempleTag](https://github.com/phoenixfisher/templeTag) iOS app.

---

## 🚀 Features

- Fast, globally distributed API (Cloudflare Workers)
- Free to host and maintain
- Filter temples by country, status, or bounding box
- CORS + caching + ETag support for efficient mobile fetches
- Versioned JSON schema (v1)
- Easy to extend or automate nightly updates

---

## 📦 Endpoints

Base URL  
```
https://templetag.temple-api.workers.dev/v1
```

| Endpoint | Description | Example |
|-----------|--------------|----------|
| `/v1` | Health check | [`/v1`](https://templetag.temple-api.workers.dev/v1) |
| `/v1/temples` | All temples | [`/v1/temples`](https://templetag.temple-api.workers.dev/v1/temples) |
| `/v1/temples/:id` | Specific temple | [`/v1/temples/st-george-utah`](https://templetag.temple-api.workers.dev/v1/temples/st-george-utah) |
| `/v1/temples?country=United%20States` | Filter by country | `/v1/temples?country=United%20States` |
| `/v1/temples?status=operating` | Filter by status | `/v1/temples?status=operating` |
| `/v1/temples?bbox=-125,24,-66,50` | Filter by bounding box (lon/lat) | `/v1/temples?bbox=-125,24,-66,50` |

---

## 🧠 Example JSON

```json
{
  "id": "st-george-utah",
  "name": "St. George Utah Temple",
  "status": "operating",
  "country": "United States",
  "region": "North America",
  "city": "St. George, Utah",
  "lat": 37.1041,
  "lng": -113.5839,
  "announced": "1871-01-01",
  "dedicated": "1877-04-06",
  "rededicated": "2023-12-10",
  "lastUpdated": "2025-10-01T00:00:00Z"
}
```

---

## ⚙️ Local Development

```bash
# install deps
npm install

# run locally
npx wrangler dev

# deploy to Cloudflare
npx wrangler deploy
```

You’ll need a free Cloudflare account and `wrangler` CLI.

---

## 🗂 Project Structure

```
temple-api/
├── data/
│   └── temples.json          # Static dataset
├── src/
│   └── index.ts              # Cloudflare Worker source
├── wrangler.toml             # Worker config
├── package.json
└── .github/
    └── workflows/deploy.yml  # (optional) nightly auto-update
```

---

## 🔁 Auto-Update (optional)

Later, you can configure a GitHub Action to rebuild `data/temples.json` nightly from open sources such as [TempleDB.org](https://www.templedb.org) or other community datasets.

Example workflow:
```bash
.github/workflows/deploy.yml
```

---

## 📄 License

MIT © 2025 [Phoenix Fisher](https://github.com/phoenixfisher)

---

**Temple API** — powering TempleTag 🏁
