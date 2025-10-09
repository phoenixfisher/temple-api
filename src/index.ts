// Minimal REST over a static JSON blob bundled in the Worker.
// Routes:
//  GET /v1                -> {ok:true}
//  GET /v1/temples        -> list with filters (?status, ?country, ?bbox, ?updatedSince)
//  GET /v1/temples/:id    -> single item or 404

interface Temple {
  id: string;
  name: string;
  status: "operating" | "renovation" | "construction" | "announced";
  country: string;
  region?: string;
  city?: string;
  lat: number;
  lng: number;
  announced?: string | null;
  dedicated?: string | null;
  rededicated?: string | null;
  website?: string | null;
  photo?: string | null;
  lastUpdated: string; // ISO8601
}

// Bundled JSON (thanks to resolveJsonModule)
import raw from "../data/temples.json";
const DATA = raw as Temple[];

const LAST_MODIFIED = new Date(
  Math.max(...DATA.map(d => Date.parse(d.lastUpdated)))
).toUTCString();
const ETAG = `"tt-${DATA.length}-${Date.parse(LAST_MODIFIED)}"`;

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, If-None-Match",
  } as Record<string, string>;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300", // 5 minutes
      ETag: ETAG,
      "Last-Modified": LAST_MODIFIED,
      ...cors(),
    },
  });
}

function filter(url: URL): Temple[] {
  let out = DATA;
  const status = url.searchParams.get("status");
  const country = url.searchParams.get("country");
  const updatedSince = url.searchParams.get("updatedSince");
  const bbox = url.searchParams.get("bbox"); // west,south,east,north

  if (status) out = out.filter(t => t.status === status);
  if (country) out = out.filter(t => t.country.toLowerCase() === country.toLowerCase());
  if (updatedSince) {
    const since = Date.parse(updatedSince);
    if (!Number.isNaN(since)) out = out.filter(t => Date.parse(t.lastUpdated) >= since);
  }
  if (bbox) {
    const [w, s, e, n] = bbox.split(",").map(Number);
    if ([w, s, e, n].every(Number.isFinite)) {
      out = out.filter(t => t.lng >= w && t.lng <= e && t.lat >= s && t.lat <= n);
    }
  }
  return out;
}

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { headers: cors() });

    // Conditional GET via ETag
    const inm = req.headers.get("If-None-Match");
    if (inm && inm === ETAG && url.pathname.startsWith("/v1/temples")) {
      return new Response(null, { status: 304, headers: cors() });
    }

    if (url.pathname === "/" || url.pathname === "/v1") {
      return json({ ok: true, name: "Temple API", version: "v1" });
    }

    if (url.pathname === "/v1/temples") {
      return json(filter(url));
    }

    const m = url.pathname.match(/^\/v1\/temples\/([^/]+)$/);
    if (m) {
      const id = decodeURIComponent(m[1]);
      const item = DATA.find(t => t.id === id);
      return item ? json(item) : json({ error: "Not found" }, 404);
    }

    return json({ error: "Route not found" }, 404);
  },
};
