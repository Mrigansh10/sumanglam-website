// Yale catalogue → hardware product catalog importer.
// Uploads each product image to Cloudinary and inserts the product (+ category
// mapping) into Supabase. Built for the Yale 2026 price list; reused per category.
//
// Usage:
//   node scripts/yale-catalogue/import-category.mjs <category-key> [--dry-run]
// e.g.
//   node scripts/yale-catalogue/import-category.mjs smart-door-locks --dry-run
//   node scripts/yale-catalogue/import-category.mjs smart-door-locks
//
// Reads .env for SUPABASE_ANON_KEY + CLOUDINARY_* + cloud name.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { v2 as cloudinary } from "cloudinary";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- env -------------------------------------------------------------------
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
const ANON = env.SUPABASE_ANON_KEY;
cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// --- fixed taxonomy (verified live) ----------------------------------------
const BRAND_ID = "cmqapqic7000frqrcsen3lz97"; // Yale
const PRODUCT_TYPE_ID = "cmqapqjrr000jrqrcr2nnu8g4"; // Hardware
const CATEGORY_BY_KEY = {
  "smart-door-locks": "cmqapqlam000urqrcgurquesr", // Digital Locks
};

// --- helpers ---------------------------------------------------------------
const sb = (path, opts = {}) =>
  fetch(`${SUPABASE_URL}/${path}`, {
    ...opts,
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function cuid() {
  return "cy" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

async function uploadImage(product, imageMeta, folder, dry) {
  const cropPath = join(__dirname, "crops", `${product.cropFile || ""}`);
  const isCrop = product.cropFile && existsSync(cropPath);
  const src = isCrop ? cropPath : imageMeta?.image_url;
  if (!src) return { publicId: null, src: null, isCrop };
  if (dry) return { publicId: `(dry) ${folder}/${product.sku}`, src, isCrop };
  const res = await cloudinary.uploader.upload(src, {
    folder,
    public_id: slugify(product.sku),
    overwrite: true,
    resource_type: "image",
  });
  return { publicId: res.public_id, src, isCrop };
}

// --- main ------------------------------------------------------------------
const categoryKey = process.argv[2];
const dry = process.argv.includes("--dry-run");
if (!categoryKey || !CATEGORY_BY_KEY[categoryKey]) {
  console.error("Unknown category key. Known:", Object.keys(CATEGORY_BY_KEY).join(", "));
  process.exit(1);
}
const CATEGORY_ID = CATEGORY_BY_KEY[categoryKey];
const folder = `sumanglam/hardware/yale/${categoryKey}`;

const data = JSON.parse(readFileSync(join(__dirname, "data", `${categoryKey}.json`), "utf8"));
const imagesArr = JSON.parse(
  readFileSync(join(__dirname, "data", `${categoryKey}.images.json`), "utf8")
);
const imageBySku = Object.fromEntries(imagesArr.map((x) => [x.sku, x]));
// products not on the store get a local crop (filename = sku.png after slug-safe)
const CROP_FILES = {
  "YDM7116A-YH": "YDM7116A-YH.png",
  "SmartCodeHandle-PVC": "SmartCodeHandle-PVC.png",
  YDL325: "YDL325.png",
};

console.log(`\n${dry ? "DRY RUN — " : ""}Importing "${data.category}" (${data.products.length} products)\n`);

const usedSlugs = new Set();
let ok = 0,
  skipped = 0,
  failed = 0;

for (const p of data.products) {
  try {
    // skip if SKU already imported
    const existsRes = await sb(`products?select=id&sku=eq.${encodeURIComponent(p.sku)}&brand_id=eq.${BRAND_ID}&limit=1`);
    const existing = await existsRes.json();
    if (Array.isArray(existing) && existing.length) {
      console.log(`  ⏭  ${p.name} — already exists (sku ${p.sku})`);
      skipped++;
      continue;
    }

    let slug = slugify(p.name);
    while (usedSlugs.has(slug)) slug += "-x";
    usedSlugs.add(slug);

    p.cropFile = CROP_FILES[p.sku];
    const { publicId, isCrop } = await uploadImage(p, imageBySku[p.sku], folder, dry);

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
      primary_image: publicId,
      gallery_images: [],
      availability_status: "available",
      technical_specs_json: p.technicalSpecs ?? null,
      is_featured: false,
      status: "published",
      created_at: now,
      updated_at: now,
    };

    if (dry) {
      console.log(`  ✓ ${p.name}  [${isCrop ? "crop" : "store"}]  slug=${slug}  img=${publicId}`);
      ok++;
      continue;
    }

    const ins = await sb("products", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    });
    if (!ins.ok) throw new Error(`product insert ${ins.status}: ${await ins.text()}`);

    const mapRes = await sb("product_category_mappings", {
      method: "POST",
      body: JSON.stringify({ product_id: row.id, category_id: CATEGORY_ID }),
    });
    if (!mapRes.ok) throw new Error(`mapping insert ${mapRes.status}: ${await mapRes.text()}`);

    console.log(`  ✓ ${p.name}  [${isCrop ? "crop" : "store"}]  slug=${slug}`);
    ok++;
  } catch (e) {
    console.error(`  ✗ ${p.name} — ${e.message}`);
    failed++;
  }
}

console.log(`\nDone. inserted=${ok} skipped=${skipped} failed=${failed}\n`);
