import fs from "node:fs/promises";

// Map TempleDB to local schema
function mapTemple(t) {
    return {
        id: t.id,
        name: t.name,
        status: t.status,
        country: t.location.country,
        state: t.location.state,
        city: t.location.city,
        address: t.location.address ?? null,
        region: t.region ?? null,
        latitude: t.location.latitude,
        longitude: t.location.longitude,       
        website: t.links?.official ?? null,
        appointments: t.links?.appointment ?? null,
        photo: pickPhoto(t).full,
        photoThumb: pickPhoto(t).thumb,
        photoCredit: pickPhoto(t).credit,
        photoCaption: pickPhoto(t).caption,
        description: t.description ?? null,
        lastUpdated: new Date().toISOString()
    };
}

// Grab photos
function pickPhoto(t) {
    // Prefer "cover", otherwise grab first full url
    const media = Array.isArray(t.media) ? t.media : [];
    const byCover = media.find(m => (m.subject || "").toLowerCase() === "cover" && (m.full || m.thumb));
    const byPhoto = media.find(m => (m.type || "").toLowerCase() === "photograph" && (m.full || m.thumb));
    const m = byCover || byPhoto || media[0] || {};

    const full = m.full || t.image || null;
    const thumb = m.thumb || null;
    const credit = m.credit || (t.imageCredit || null);
    const caption = m.caption || null;

    return { full, thumb, credit, caption };
}


async function main() {
    // Fetch from TempleDB RestAPI (templedb.org/api)
    const res = await fetch("https://templedb.org/api/temples?limit=10000");
    if (!res.ok) throw new Error(`TempleDB fetch failed: ${res.status}`);
    const data = await res.json();

    // Normalize and map
    const temples = Array.isArray(data) ? data : data.temples || data.results || [];
    const out = temples.map(mapTemple);

    // Example import printed to console
    console.log("Example import:");
    console.dir(out[0], { depth: null, colors: true });

    await fs.writeFile("data/temples.json.", JSON.stringify(out, null, 2));
    console.log(`Wrote ${out.length} temples to data/temples.json`);
}

main().catch(e => { console.error(e); process.exit(1); });