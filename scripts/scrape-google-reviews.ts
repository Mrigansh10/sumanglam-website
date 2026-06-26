/**
 * Scrape Google Maps reviews for Sumanglam and save to data/google-reviews.json.
 *
 * Run: npm run scrape:reviews
 *
 * What happens:
 *   1. A Chrome window opens with the Sumanglam Google Maps page.
 *   2. You sign in to Google in that window (only needed once per 6 months).
 *   3. You press ENTER in this terminal when you're signed in and can see reviews.
 *   4. The script scrapes and saves data/google-reviews.json.
 *   5. Commit the updated file and deploy — done.
 */

import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";
import * as readline from "readline";

const MAPS_URL =
  "https://www.google.com/maps/place/%E2%9C%85Sumanglam+-+Hardware+%7CKitchen+%7CWardrobe/@26.8792033,75.7584208,17z/data=!3m1!4b1!4m6!3m5!1s0x396db457e77f7c4f:0xe14b0ebfccecb10a!8m2!3d26.8792033!4d75.7609957!16s%2Fg%2F11bw3dsg3n";

const OUT_PATH = join(process.cwd(), "data", "google-reviews.json");
const MAX_REVIEWS = 10;

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

async function scrapeGoogleReviews(): Promise<Output> {
  let browser;
  try {
    browser = await chromium.launch({ headless: false, channel: "chrome" });
  } catch {
    browser = await chromium.launch({ headless: false });
  }

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    locale: "en-US",
    timezoneId: "Asia/Kolkata",
    viewport: { width: 1280, height: 900 },
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  const page = await context.newPage();

  console.log("\nOpening Google Maps in a browser window…\n");
  await page.goto(MAPS_URL, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(3000);

  // ── Interactive step ───────────────────────────────────────────────────────
  console.log("─".repeat(60));
  console.log("ACTION REQUIRED:");
  console.log("");
  console.log("  In the Chrome window that just opened:");
  console.log("  1. Click 'Sign in' (top-right or in the left panel).");
  console.log("  2. Log in with any Google account.");
  console.log("  3. Come back to the Sumanglam Maps page.");
  console.log("  4. Click the 'Reviews' tab in the left panel.");
  console.log("  5. Make sure you can see the list of reviews.");
  console.log("");
  console.log("  When the reviews are visible, press ENTER here to continue.");
  console.log("─".repeat(60));
  await waitForEnter("\n  → Press ENTER when reviews are visible in the browser: ");
  console.log("\nContinuing…");

  // ── Extract aggregate rating ───────────────────────────────────────────────
  let overallRating = 0;
  let totalRatings = 0;

  try {
    const ratingText = await page.evaluate(() => {
      for (const el of Array.from(document.querySelectorAll("*"))) {
        if (el.children.length === 0) {
          const t = (el as HTMLElement).innerText?.trim() ?? "";
          if (/^[1-5]\.\d$/.test(t)) return t;
        }
      }
      return null;
    });
    if (ratingText) {
      overallRating = parseFloat(ratingText);
      console.log(`Overall rating: ${overallRating}`);
    }

    const countText = await page.evaluate(() => {
      for (const el of Array.from(document.querySelectorAll("*"))) {
        if (el.children.length === 0) {
          const t = (el as HTMLElement).innerText?.trim() ?? "";
          if (/^[\d,]+\s+reviews?$/i.test(t)) return t;
        }
      }
      return null;
    });
    if (countText) {
      const m = countText.match(/([\d,]+)/);
      if (m) totalRatings = parseInt(m[1].replace(/,/g, ""), 10);
      console.log(`Total: ${totalRatings} (from "${countText}")`);
    }
  } catch {
    console.warn("Could not read rating.");
  }

  // ── Scroll the reviews panel ───────────────────────────────────────────────
  console.log("Scrolling to load more reviews…");
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => {
      const panel =
        document.querySelector('[aria-label*="Reviews for"]') ||
        document.querySelector('[role="main"]') ||
        document.querySelector("#QA0Szd") ||
        document.querySelector(".m6QErb");
      if (panel) panel.scrollTop += 600;
    });
    await page.waitForTimeout(600);
  }

  // Expand truncated "More" buttons
  const moreButtons = page.locator('button').filter({ hasText: /^more$/i });
  const moreCount = await moreButtons.count();
  for (let i = 0; i < Math.min(moreCount, MAX_REVIEWS); i++) {
    try { await moreButtons.nth(i).click(); await page.waitForTimeout(200); }
    catch { /* ignore */ }
  }

  // ── Extract review cards ───────────────────────────────────────────────────
  let reviewCards = page.locator("[data-review-id]");
  let cardCount = await reviewCards.count();
  if (cardCount === 0) {
    reviewCards = page.locator('[jslog*="review"]');
    cardCount = await reviewCards.count();
  }
  if (cardCount === 0) {
    reviewCards = page.locator('[role="feed"] > div');
    cardCount = await reviewCards.count();
  }
  console.log(`Found ${cardCount} review card(s).`);

  const reviews: ReviewEntry[] = [];

  for (let i = 0; i < Math.min(cardCount, MAX_REVIEWS); i++) {
    const card = reviewCards.nth(i);
    try {
      const authorName =
        (await card.locator(".d4r55").first().textContent().catch(() => null)) ??
        (await card.locator("[class*='name']").first().textContent().catch(() => null)) ??
        "Anonymous";

      const starsLabel = await card
        .locator("[aria-label*='out of 5'], [aria-label*=' star']")
        .first()
        .getAttribute("aria-label")
        .catch(() => null);
      const starsMatch = starsLabel?.match(/(\d+(?:\.\d+)?)/);
      const rating = starsMatch ? Math.round(parseFloat(starsMatch[1])) : 5;

      const relativeTime =
        (await card.locator(".rsqaWe").first().textContent().catch(() => null)) ?? "";

      const text =
        (await card.locator(".wiI7pd").first().textContent().catch(() => null)) ?? "";

      if (!text.trim()) continue;

      reviews.push({
        authorName: authorName.trim(),
        rating,
        text: text.trim(),
        relativeTime: relativeTime.trim(),
      });
      console.log(`  ✓ ${authorName.trim()} (${rating}★)`);
    } catch {
      console.warn(`  ✗ Could not parse review ${i + 1}`);
    }
  }

  await browser.close();

  return {
    rating: overallRating,
    userRatingsTotal: totalRatings,
    reviews,
    lastScraped: new Date().toISOString(),
  };
}

scrapeGoogleReviews()
  .then((data) => {
    writeFileSync(OUT_PATH, JSON.stringify(data, null, 2));
    console.log(`\nDone — saved ${data.reviews.length} reviews to data/google-reviews.json`);
    if (data.reviews.length === 0) {
      console.warn(
        "\nNo reviews captured. Possible reasons:\n" +
          "  • Reviews weren't visible yet when you pressed ENTER (wait longer)\n" +
          "  • Google Maps CSS classes changed — update .d4r55 / .wiI7pd / .rsqaWe\n" +
          "  • Try running again and scrolling through several reviews before pressing ENTER"
      );
    } else {
      console.log("Commit data/google-reviews.json and redeploy to publish the reviews.");
    }
  })
  .catch((err) => {
    console.error("Scrape failed:", err);
    process.exit(1);
  });
