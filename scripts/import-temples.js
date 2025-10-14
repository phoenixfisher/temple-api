import fs from "node:fs/promises";

// Map TempleDB to local schema
function mapTemple(t) {
    return {
        id: t.slug,
        name: t.name,
        status: t.status,
        country: t.country,
        region: t.region ?? null,
        city: t.city ?? null,
        lat: t.latitude,
        lng: t.longitude,
        announced: t.announced ?? null,
        dedicated: t.dedicated ?? null,
        rededicated: t.rededicated ?? null,
        website: t.url ?? null,
        photo: t.image ?? null,
        lastUpdated: new Date().toISOString()
    };
}

async function main() {
    // Fetch from TempleDB RestAPI (templedb.org/api)
    const res = await fetch("https://templedb.org/api/temples?limit=10000");
    if (!res.ok) throw new Error(`TempleDB fetch failed: ${res.status}`);
    const data = await res.json();

    // Normalize and map
    const temples = Array.isArray(data) ? data : data.temples || data.results || [];
    const out = temples.map(mapTemple);

    await fs.writeFile("data/temples.json", JSON.stringify(out, null, 2));
    console.log(`Wrote ${out.length} temples to data/temples.json`);
}

main().catch(e => { console.error(e); process.exit(1); });