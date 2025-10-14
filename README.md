# Temple API

A lightweight, public API for LDS temple data — locations, status, details, photos, and summary counts — built and served on **Cloudflare Workers**. The API provides up-to-date information about every LDS temple, including photos, geolocation, and summary statistics, all in a consistent JSON schema.

This API powers the [TempleTag](https://github.com/phoenixfisher/templeTag) iOS app.

---

## Features

- Fast, globally distributed API (Cloudflare Workers)
- Free to host and maintain
- Filter temples by country, status, or bounding box
- CORS + caching + ETag support for efficient mobile fetches
- Versioned JSON schema (v1)
- Each temple includes photo URLs, captions, and credits
- Summary counts: total, by country, by status, and more
- `/v1/count` endpoint for quick stats and breakdowns
- Easy to extend or automate nightly updates

---

## Endpoints

Base URL

```
https://templetag.temple-api.workers.dev/v1
```

| Endpoint                              | Description                                 | Example                                                                                            |
| ------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `/v1`                                 | Health check                                | [`/v1`](https://templetag.temple-api.workers.dev/v1)                                               |
| `/v1/temples`                         | All temples                                 | [`/v1/temples`](https://templetag.temple-api.workers.dev/v1/temples)                               |
| `/v1/temples/:id`                     | Specific temple                             | [`/v1/temples/st-george-utah`](https://templetag.temple-api.workers.dev/v1/temples/st-george-utah) |
| `/v1/temples?country=United%20States` | Filter by country                           | `/v1/temples?country=United%20States`                                                              |
| `/v1/temples?status=dedicated`        | Filter by status                            | `/v1/temples?status=dedicated`                                                                     |
| `/v1/temples?bbox=-125,24,-66,50`     | Filter by bounding box (lon/lat)            | `/v1/temples?bbox=-125,24,-66,50`                                                                  |
| `/v1/count`                           | Summary counts (total, byStatus, byCountry) | `/v1/count`                                                                                        |

---

## Example JSON

### `temples.json` (single temple object)

```json
{
  "id": "aba-nigeria-temple",
  "name": "Aba Nigeria Temple",
  "status": "dedicated",
  "country": "Nigeria",
  "state": "Abia State",
  "city": "Aba",
  "address": "72-80 Okpu-Umuobo Rd",
  "latitude": 5.147644,
  "longitude": 7.356719,
  "website": "https://www.churchof...",
  "appointments": "https://www.churchof...",
  "photo": "https://www.temple...",
  "photoThumb": "https://www.temple...",
  "photoCredit": "churchofjesuschrist.org",
  "photoCaption": "Aba Nigeria Temple",
  "description": "The Aba Nigeria Temple is prominently ...",
  "lastUpdated": "2025-10-14T22:27:17.695Z"
}
```

### `count.json` (summary counts)

```json
{
  "total": 384,
  "byStatus": {
    "dedicated": 208,
    "announced": 110,
    "under_construction": 61,
    "unknown": 5
  },
  "byCountry": {
    "Nigeria": 7,
    "Cote d'Ivoire": 1,
    "...": "..."
  },
  "timestamp": "2025-10-14T22:27:17.697Z",
  "version": "1.0"
}
```

---

## Local Development

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

## Project Structure

```
temple-api/
├── data/
│   ├── temples.json          # All temple details (primary dataset)
│   └── count.json            # Summary counts (total, byStatus, byCountry)
├── src/
│   └── index.ts              # Cloudflare Worker source
├── wrangler.toml             # Worker config
├── package.json
└── .github/
    └── workflows/deploy.yml  # (optional) nightly auto-update
```

---

## Auto-Update (NA yet)

You can configure a GitHub Action to rebuild both `data/temples.json` and `data/count.json` nightly from open sources such as [TempleDB.org](https://www.templedb.org) or other community datasets. Nightly imports regenerate both the full temple dataset and the summary count file.

Example workflow:

```bash
.github/workflows/deploy.yml
```

---

## License

MIT © 2025 [Phoenix Fisher](https://github.com/phoenixfisher)

---

**Temple API** — powering TempleTag 🏁
