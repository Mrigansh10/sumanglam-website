/**
 * Scrape real Google Maps reviews for Sumanglam.
 *
 * Run:  npm run scrape:reviews
 *
 * Google serves a "limited view" of Maps to signed-out browsers — the review
 * list is simply absent from the DOM — so this cannot run headless/unattended.
 * It opens a real Chrome window and waits for you to sign in.
 *
 * The browser profile is persisted in .playwright-google-profile/, so the
 * sign-in survives between runs and you normally only do it once.
 *
 * Outputs:
 *   data/google-reviews.raw.json  — every review captured (for curation)
 *   data/google-reviews.json      — what the site renders
 *
 * Safety: if zero reviews are captured, NOTHING is written. A previous version
 * of this file shipped with placeholder review data that was never replaced,
 * and it went live. Never write an unverified file over the live one.
 */

import { chromium, type BrowserContext, type Page } from "playwright";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import * as readline from "readline";

const MAPS_URL =
  "https://www.google.com/maps/place/%E2%9C%85Sumanglam+-+Hardware+%7CKitchen+%7CWardrobe/@26.8792033,75.7584208,17z/data=!3m1!4b1!4m6!3m5!1s0x396db457e77f7c4f:0xe14b0ebfccecb10a!8m2!3d26.8792033!4d75.7609957!16s%2Fg%2F11bw3dsg3n?hl=en";

const DATA_DIR = join(process.cwd(), "data");
const OUT_PATH = join(DATA_DIR, "google-reviews.json");
const RAW_PATH = join(DATA_DIR, "google-reviews.raw.json");
const PROFILE_DIR = join(process.cwd(), ".playwright-google-profile");

/** How many reviews the site renders. Raw capture is unlimited. */
const PUBLISH_COUNT = 12;

type ReviewEntry = {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
};

type Output = {
  rating: number;
  userRatingsTotal: number;
  reviews: ReviewEntry[];
  lastScraped: string;
};

function waitForEnter(prompt: string): Promise<void> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(prompt, () => {
      rl.close();
      resolve();
    });
  });
}

/** Read the aggregate rating and total review count from the place panel. */
async function readAggregate(page: Page): Promise<{ rating: number; total: number }> {
  return page.evaluate(() => {
    let rating = 0;
    let total = 0;
    for (const el of Array.from(document.querySelectorAll("*"))) {
      if (el.children.length !== 0) continue;
      const t = (el as HTMLElement).innerText?.trim() ?? "";
      if (!rating && /^[1-5]\.\d$/.test(t)) rating = parseFloat(t);
      if (!total && /^\(?[\d,]+\)?\s*reviews?$/i.test(t)) {
        total = parseInt(t.replace(/[^\d]/g, ""), 10);
      }
    }
    return { rating, total };
  });
}

/** The scrollable reviews feed, whichever container Google is using today. */
async function scrollFeed(page: Page): Promise<void> {
  let stable = 0;
  let last = 0;
  for (let i = 0; i < 120 && stable < 4; i++) {
    const count = await page.locator("[data-review-id]").count();
    if (count === last) stable += 1;
    else stable = 0;
    last = count;

    await page.evaluate(() => {
      const feed =
        document.querySelector('[role="feed"]') ??
        document.querySelector(".m6QErb.DxyBCb") ??
        Array.from(document.querySelectorAll(".m6QErb")).find(
          (el) => el.scrollHeight > el.clientHeight + 50,
        ) ??
        null;
      if (feed) (feed as HTMLElement).scrollTop = (feed as HTMLElement).scrollHeight;
    });
    await page.waitForTimeout(700);
  }
  process.stdout.write(`\n  loaded ${last} review card(s)\n`);
}

/** Click every "More" so long reviews aren't captured truncated. */
async function expandAll(page: Page): Promise<void> {
  const more = page.locator("button").filter({ hasText: /^More$/ });
  const n = await more.count();
  for (let i = 0; i < n; i += 1) {
    try {
      await more.nth(i).click({ timeout: 700 });
    } catch {
      /* card scrolled out of view — fine */
    }
  }
  await page.waitForTimeout(800);
}

async function extract(page: Page): Promise<ReviewEntry[]> {
  return page.evaluate(() => {
    const pick = (card: Element, sels: string[]): string => {
      for (const s of sels) {
        const t = (card.querySelector(s) as HTMLElement | null)?.innerText?.trim();
        if (t) return t;
      }
      return "";
    };

    const out: ReviewEntry[] = [];
    const seen = new Set<string>();

    for (const card of Array.from(document.querySelectorAll("[data-review-id]"))) {
      const authorName = pick(card, [".d4r55", "[class*='title'] span", "button[aria-label] div"]);
      const text = pick(card, [".wiI7pd", "[class*='text']", "span[jsan]"]);
      const relativeTime = pick(card, [".rsqaWe", "[class*='date']"]);

      const label =
        card.querySelector("[aria-label*='star']")?.getAttribute("aria-label") ??
        card.querySelector("[aria-label*='out of 5']")?.getAttribute("aria-label") ??
        "";
      const rating = parseFloat((label.match(/(\d+(?:\.\d+)?)/) ?? [])[1] ?? "0");

      if (!authorName || !text) continue;
      const key = `${authorName}|${text.slice(0, 48)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      out.push({ authorName, rating, text, relativeTime });
    }
    return out;
  });
}

async function run(): Promise<void> {
  if (!existsSync(PROFILE_DIR)) mkdirSync(PROFILE_DIR, { recursive: true });

  let ctx: BrowserContext;
  try {
    ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
      headless: false,
      channel: "chrome",
      viewport: { width: 1400, height: 1000 },
      locale: "en-IN",
      timezoneId: "Asia/Kolkata",
    });
  } catch {
    ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
      headless: false,
      viewport: { width: 1400, height: 1000 },
      locale: "en-IN",
      timezoneId: "Asia/Kolkata",
    });
  }

  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(MAPS_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3000);

  const limited = await page.evaluate(() => document.body.innerText.includes("limited view"));

  console.log("\n" + "─".repeat(66));
  console.log("ACTION REQUIRED — in the Chrome window that just opened:");
  console.log("");
  if (limited) {
    console.log("  Google is showing a LIMITED VIEW because you're signed out.");
    console.log("  The review list is not in the page at all until you sign in.");
    console.log("");
  }
  console.log("  1. Click 'Sign in' (top-right) and log in with any Google account.");
  console.log("  2. Return to the Sumanglam place page.");
  console.log("  3. Click the 'Reviews' tab so the review list is on screen.");
  console.log("  4. Optional: set Sort to 'Newest' for a fair, current sample.");
  console.log("");
  console.log("  Then press ENTER here. (Your login is saved for next time.)");
  console.log("─".repeat(66));
  await waitForEnter("\n  → ENTER once the reviews are visible: ");

  const { rating, total } = await readAggregate(page);
  console.log(`\nAggregate: ${rating || "?"}★ from ${total || "?"} reviews`);

  console.log("Loading the full review list…");
  await scrollFeed(page);
  await expandAll(page);

  const reviews = await extract(page);
  await ctx.close();

  if (reviews.length === 0) {
    console.error("\n✗ Captured 0 reviews — NOTHING was written.\n");
    console.error("  Likely causes:");
    console.error("   • The Reviews tab wasn't open when you pressed ENTER.");
    console.error("   • You weren't fully signed in (still the 'limited view').");
    console.error("   • Google changed its markup — update the selectors in extract().");
    process.exitCode = 1;
    return;
  }

  writeFileSync(RAW_PATH, JSON.stringify({ rating, total, reviews }, null, 2));

  const published = reviews.slice(0, PUBLISH_COUNT);
  const data: Output = {
    rating: rating || 0,
    userRatingsTotal: total || 0,
    reviews: published,
    lastScraped: new Date().toISOString(),
  };
  writeFileSync(OUT_PATH, JSON.stringify(data, null, 2));

  console.log(`\n✓ Captured ${reviews.length} review(s).`);
  console.log(`  → all of them:  data/google-reviews.raw.json`);
  console.log(`  → site renders: data/google-reviews.json (${published.length})`);
  console.log(`\nReview the file, then commit and redeploy to publish.`);
}

run().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
