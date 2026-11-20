// Brand price list → hardware product catalog importer.
//
// For each product in data/<brand>/<key>.json:
//   1. upload its official studio photo to Cloudinary (sumanglam/hardware/<brand>/official/<slug>)
//   2. remove the background (e_background_removal/e_trim) and store the cut-out
//      as its own asset (sumanglam/hardware/<brand>/cutouts/<slug>), so visitors
//      never wait for the background removal to run
//   3. insert the product as a DRAFT and map it to its site category
//
// Review drafts locally with `PREVIEW_DRAFTS=1 npx next dev`, then publish.
// Prices are stored in price_range for reference only; the site never shows them.
//
// Usage:
//   node scripts/hardware-catalogue/import-category.mjs <brand>/<data-key> [--dry-run]
//   node scripts/hardware-catalogue/import-category.mjs <brand>/<data-key> --images <SKU,SKU>
//     re-bakes the photo for those existing products (after changing `image`)
//
// Data file shape: { brand, siteCategory, imageBase?, products: [{ name, sku,
//   shortDescription, technicalSpecs, priceRange, image }] } where `image` is a
//   full URL, a path under crops/, a file name under `imageBase`, or (Yale) an
//   ASSA ABLOY asset id (gw-assets.assaabloy.com/is/image/assaabloy/<id>).

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { v2 as cloudinary } from "cloudinary";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const env = {};
  const txt = readFileSync(join(__dirname, "../../.env"), "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}
const env = loadEnv();
const SUPABASE_URL = "https://yikrshucrahamejrsklp.supabase.co/rest/v1";
// The anon key reads nothing since the RLS lockdown; writes need the service role.
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const CLOUD = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "de9turgsy";
cloudinary.config({ cloud_name: CLOUD, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET });

const PRODUCT_TYPE_ID = "cmqapqjrr000jrqrcr2nnu8g4"; // Hardware

const sb = (path, opts = {}) =>
  fetch(`${SUPABASE_URL}/${path}`, {
    ...opts,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...(opts.headers || {}) },
  });

function slugify(s) {
  return s.toLowerCase().replace(/\+/g, " plus ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function cuid() {
  return "cy" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function imageSource(image, imageBase) {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  const crop = join(__dirname, "crops", image);
  if (existsSync(crop)) return crop;
  if (imageBase) return encodeURI(imageBase + image);
  return `https://gw-assets.assaabloy.com/is/image/assaabloy/${image}?wid=2000&fmt=png-alpha`;
}

async function bakeCutout(slug, source) {
  const official = await cloudinary.uploader.upload(source, {
    public_id: `sumanglam/hardware/${BRAND}/official/${slug}`,
    overwrite: true,
  });
  // Background removal runs on first request and answers 423 until it's done.
  const derived = `https://res.cloudinary.com/${CLOUD}/image/upload/e_background_removal/e_trim/f_png/${official.public_id}`;
  for (let attempt = 0; attempt < 60; attempt++) {
    const res = await fetch(derived, { method: "HEAD" });
    if (res.ok) break;
    await sleep(3000);
  }
  const cut = await cloudinary.uploader.upload(derived, {
    public_id: `sumanglam/hardware/${BRAND}/cutouts/${slug}`,
    overwrite: true,
  });
  return cut.public_id;
}

const key = process.argv[2];
const dry = process.argv.includes("--dry-run");
const imagesFlag = process.argv.indexOf("--images");
const refresh = imagesFlag > -1 ? new Set(process.argv[imagesFlag + 1].split(",")) : null;
const file = join(__dirname, "data", `${key}.json`);
if (!key || !existsSync(file)) {
  console.error(`No data file for "${key}" in scripts/hardware-catalogue/data/ (use <brand>/<key>)`);
  process.exit(1);
}
const data = JSON.parse(readFileSync(file, "utf8"));
const BRAND = data.brand;
const brandRes = await sb(`brands?select=id&slug=eq.${BRAND}`);
const BRAND_ID = (await brandRes.json())[0]?.id;
if (!BRAND_ID) {
  console.error(`Brand "${BRAND}" does not exist.`);
  process.exit(1);
}

const catRes = await sb(`product_categories?select=id&slug=eq.${data.siteCategory}&product_type_id=eq.${PRODUCT_TYPE_ID}`);
const CATEGORY_ID = (await catRes.json())[0]?.id;
if (!CATEGORY_ID) {
  console.error(`Site category "${data.siteCategory}" does not exist yet. Create it first.`);
  process.exit(1);
}

console.log(`\n${dry ? "DRY RUN — " : ""}${key} → ${data.siteCategory} (${data.products.length} products)\n`);
let ok = 0, skipped = 0, failed = 0, noImage = 0;

for (const p of data.products) {
  try {
    const existing = await (await sb(`products?select=id&sku=eq.${encodeURIComponent(p.sku)}&brand_id=eq.${BRAND_ID}&limit=1`)).json();
    if (existing.length && refresh?.has(p.sku)) {
      const slugRow = await (await sb(`products?select=slug&id=eq.${existing[0].id}`)).json();
      // New asset name, so CDN and image-optimiser caches can't serve the old photo.
      const primary = await bakeCutout(`${slugRow[0].slug}-r${Date.now().toString(36)}`, imageSource(p.image, data.imageBase));
      await sb(`products?id=eq.${existing[0].id}`, {
        method: "PATCH",
        body: JSON.stringify({ primary_image: primary, gallery_images: [primary], updated_at: new Date().toISOString() }),
      });
      console.log(`  ↻ ${p.name} — photo refreshed`);
      ok++;
      continue;
    }
    if (refresh) continue;
    if (existing.length) {
      console.log(`  ⏭  ${p.name} — already exists (sku ${p.sku})`);
      skipped++;
      continue;
    }

    let slug = slugify(p.name);
    const taken = await (await sb(`products?select=id&slug=eq.${slug}&limit=1`)).json();
    if (taken.length) slug = `${slug}-${slugify(p.sku)}`;

    const source = imageSource(p.image, data.imageBase);
    if (!source) noImage++;
    if (dry) {
      console.log(`  ✓ ${p.name}  slug=${slug}  image=${source ? "yes" : "MISSING"}`);
      ok++;
      continue;
    }
    const primary = source ? await bakeCutout(slug, source) : null;

    const now = new Date().toISOString();
    const row = {
      id: cuid(),
      name: p.name,
      slug,
      sku: p.sku,
      brand_id: BRAND_ID,
      product_type_id: PRODUCT_TYPE_ID,
      subcategory_id: null,
      short_description: p.shortDescription ?? null,
      long_description: null,
      price_range: p.priceRange ?? null,
      primary_image: primary,
      gallery_images: primary ? [primary] : [],
      availability_status: "available",
      technical_specs_json: p.technicalSpecs ?? null,
      is_featured: false,
      status: "draft",
      created_at: now,
      updated_at: now,
    };
    const ins = await sb("products", { method: "POST", body: JSON.stringify(row) });
    if (!ins.ok) throw new Error(`product insert ${ins.status}: ${await ins.text()}`);
    const map = await sb("product_category_mappings", {
      method: "POST",
      body: JSON.stringify({ product_id: row.id, category_id: CATEGORY_ID }),
    });
    if (!map.ok) throw new Error(`mapping insert ${map.status}: ${await map.text()}`);

    console.log(`  ✓ ${p.name}${primary ? "" : "  (no image)"}`);
    ok++;
  } catch (e) {
    console.error(`  ✗ ${p.name} — ${e.message}`);
    failed++;
  }
}

console.log(`\nDone. inserted=${ok} skipped=${skipped} failed=${failed} without-image=${noImage}\n`);
