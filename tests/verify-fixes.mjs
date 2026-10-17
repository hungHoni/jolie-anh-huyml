import { chromium } from "/Users/q/.claude/skills/gstack/node_modules/playwright/index.mjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexPath = "file://" + join(__dirname, "..", "index.html");

async function runVerification() {
  console.log("=== STARTING PLAYWRIGHT VERIFICATION ===");
  const browser = await chromium.launch({ headless: true });
  
  // 1. Mobile verification (iPhone 14 / Safari layout)
  console.log("\n--- TEST 1: Mobile Intro, Single-Card Scroll, and Swipe-Right Back ---");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    hasTouch: true,
    isMobile: true
  });
  const page = await mobileContext.newPage();
  await page.goto(indexPath, { waitUntil: "networkidle" });

  // Check intro anime pusher walking cadence
  const introChar = page.locator("#introAnimeChar");
  await introChar.waitFor({ state: "visible" });
  console.log("✓ Anime character visible during intro push");
  
  // Sample frame switches over 1.2s to confirm slow cadence
  const frames = [];
  for (let i = 0; i < 6; i++) {
    const src = await introChar.getAttribute("src");
    frames.push(src);
    await page.waitForTimeout(200);
  }
  console.log("Observed intro frames over 1.2s:", frames);

  // Wait for intro to dismiss
  await page.waitForSelector("#introOverlay", { state: "detached", timeout: 8000 });
  console.log("✓ Intro smoothly completed and unveiled portfolio");

  // Verify initial card is Card 0 (RESORT 2026)
  const initialCounter = await page.locator("#counterActiveNum").textContent();
  console.log("Initial active card counter:", initialCounter);
  if (initialCounter !== "01") throw new Error(`Expected initial card 01, got ${initialCounter}`);

  // Test Mobile Touch Drag: Single Card at a Time
  console.log("Simulating single touch drag upward to scroll to next card...");
  const stage = page.locator("#wheelStage");
  const box = await stage.boundingBox();
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  // Touch swipe up by 80px (drag base + 1)
  await page.touchscreen.tap(startX, startY);
  await page.evaluate(() => {
    const stageEl = document.getElementById("wheelStage");
    const tStart = new Touch({ identifier: 1, target: stageEl, clientX: 200, clientY: 500 });
    stageEl.dispatchEvent(new TouchEvent("touchstart", { touches: [tStart], changedTouches: [tStart], bubbles: true }));

    const tMove = new Touch({ identifier: 1, target: stageEl, clientX: 200, clientY: 420 });
    stageEl.dispatchEvent(new TouchEvent("touchmove", { touches: [tMove], changedTouches: [tMove], bubbles: true }));

    const tEnd = new Touch({ identifier: 1, target: stageEl, clientX: 200, clientY: 420 });
    stageEl.dispatchEvent(new TouchEvent("touchend", { touches: [], changedTouches: [tEnd], bubbles: true }));
  });

  // Wait for lerp to settle
  await page.waitForTimeout(600);
  const cardAfterSwipe1 = await page.locator("#counterActiveNum").textContent();
  console.log("Active card after swipe 1:", cardAfterSwipe1);
  if (cardAfterSwipe1 !== "02") throw new Error(`Expected card 02 after 1 swipe, got ${cardAfterSwipe1}`);
  console.log("✓ Touch swipe advanced STRICTLY ONE card (from 01 to 02)!");

  // Simulate a SECOND swipe upward
  await page.evaluate(() => {
    const stageEl = document.getElementById("wheelStage");
    const tStart = new Touch({ identifier: 2, target: stageEl, clientX: 200, clientY: 500 });
    stageEl.dispatchEvent(new TouchEvent("touchstart", { touches: [tStart], changedTouches: [tStart], bubbles: true }));

    const tMove = new Touch({ identifier: 2, target: stageEl, clientX: 200, clientY: 400 });
    stageEl.dispatchEvent(new TouchEvent("touchmove", { touches: [tMove], changedTouches: [tMove], bubbles: true }));

    const tEnd = new Touch({ identifier: 2, target: stageEl, clientX: 200, clientY: 400 });
    stageEl.dispatchEvent(new TouchEvent("touchend", { touches: [], changedTouches: [tEnd], bubbles: true }));
  });
  await page.waitForTimeout(600);
  const cardAfterSwipe2 = await page.locator("#counterActiveNum").textContent();
  console.log("Active card after swipe 2:", cardAfterSwipe2);
  if (cardAfterSwipe2 !== "03") throw new Error(`Expected card 03 after second swipe, got ${cardAfterSwipe2}`);
  console.log("✓ Second touch swipe advanced STRICTLY ONE card (from 02 to 03)!");

  // Test Project Detail Modal & Swipe-Right Back
  console.log("\n--- TEST 2: Open Project Modal & Swipe Right to Return to Scrolling Screen ---");
  await page.evaluate(() => {
    const card = document.querySelector(".wheel-card[data-index='2']");
    card.click();
  });
  await page.waitForTimeout(400);

  // Check backdrop is open
  const isBackdropOpen = await page.locator("#projectSheetBackdrop").evaluate(el => el.classList.contains("open"));
  console.log("Is project sheet open:", isBackdropOpen);
  if (!isBackdropOpen) throw new Error("Project sheet backdrop did not open on card click");

  // Check URL hash is pushed
  const hash = await page.evaluate(() => window.location.hash);
  console.log("Current URL hash:", hash);
  if (!hash.startsWith("#project-")) throw new Error(`Expected hash starting with #project-, got ${hash}`);
  console.log("✓ History state pushed successfully with hash", hash);

  // Now simulate horizontal swipe-right on the project sheet
  console.log("Simulating swipe-right gesture on project sheet...");
  await page.evaluate(() => {
    const sheetEl = document.getElementById("projectSheet");
    const tStart = new Touch({ identifier: 3, target: sheetEl, clientX: 40, clientY: 300 });
    sheetEl.dispatchEvent(new TouchEvent("touchstart", { touches: [tStart], changedTouches: [tStart], bubbles: true }));

    // Swipe horizontally right by 120px
    const tMove = new Touch({ identifier: 3, target: sheetEl, clientX: 160, clientY: 302 });
    sheetEl.dispatchEvent(new TouchEvent("touchmove", { touches: [tMove], changedTouches: [tMove], bubbles: true }));

    const tEnd = new Touch({ identifier: 3, target: sheetEl, clientX: 160, clientY: 302 });
    sheetEl.dispatchEvent(new TouchEvent("touchend", { touches: [], changedTouches: [tEnd], bubbles: true }));
  });

  // Wait for slide-out animation to finish
  await page.waitForTimeout(450);
  const isBackdropOpenAfterSwipe = await page.locator("#projectSheetBackdrop").evaluate(el => el.classList.contains("open"));
  console.log("Is project sheet open after swipe right:", isBackdropOpenAfterSwipe);
  if (isBackdropOpenAfterSwipe) throw new Error("Project sheet should be closed after swipe-right");

  const hashAfterSwipe = await page.evaluate(() => window.location.hash);
  console.log("Hash after swipe right:", hashAfterSwipe);
  if (hashAfterSwipe.startsWith("#project-")) throw new Error(`Hash was not cleared: ${hashAfterSwipe}`);
  console.log("✓ Swipe right cleanly dismissed sheet and returned to scrolling screen (exactly 1 back, not 2 back)!");

  // Verify we are still on the scrolling screen
  const isWorkViewActive = await page.locator("#viewWork").evaluate(el => el.classList.contains("active"));
  console.log("Is Work scrolling view active:", isWorkViewActive);
  if (!isWorkViewActive) throw new Error("Should be on the Work scrolling screen");

  // 2. Desktop Wheel Verification (Locked debounce: 1 card per wheel flick)
  console.log("\n--- TEST 3: Desktop Wheel Scroll — Strictly ONE Card at a Time ---");
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(indexPath + "?nosplash=1", { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(300);

  const initialDesktopCounter = await desktopPage.locator("#counterActiveNum").textContent();
  console.log("Desktop initial counter:", initialDesktopCounter);

  // Send rapid succession of wheel events (simulating trackpad momentum)
  console.log("Dispatching a burst of 5 rapid wheel events (trackpad momentum simulation)...");
  await desktopPage.evaluate(() => {
    for (let i = 0; i < 5; i++) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 80, bubbles: true }));
    }
  });

  await desktopPage.waitForTimeout(600);
  const desktopCounterAfterBurst = await desktopPage.locator("#counterActiveNum").textContent();
  console.log("Desktop counter after burst of 5 wheel events:", desktopCounterAfterBurst);
  if (desktopCounterAfterBurst !== "02") throw new Error(`Expected strictly 1 card increment (02), got ${desktopCounterAfterBurst}`);
  console.log("✓ Trackpad wheel burst advanced STRICTLY ONE card (debounced lock verified)!");

  // Capture verification screenshots
  await page.screenshot({ path: "tests/evidence-mobile-swipe-verified.png" });
  await desktopPage.screenshot({ path: "tests/evidence-desktop-wheel-verified.png" });
  console.log("✓ Saved verification screenshots");

  await browser.close();
  console.log("\n=== ALL PLAYWRIGHT VERIFICATION CHECKS PASSED PERFECTLY ===");
}

runVerification().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
