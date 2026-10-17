import { describe, test, expect } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const htmlPath = join(import.meta.dir, "..", "index.html");

describe("Jolie Anh Portfolio — huyml.co Style", () => {
  test("index.html exists and loads huyml.co signature fonts & color tokens", () => {
    expect(existsSync(htmlPath)).toBe(true);
    const html = readFileSync(htmlPath, "utf8");

    // Exact huyml.co fonts from Framer CDN
    expect(html).toContain("BT Glyphius");
    expect(html).toContain("BT Grotesk");
    expect(html).toContain("F37 Bolton");
    expect(html).toContain("xirQ3g4Sv5q7MG0KvL1PiOOLLBA.woff2");

    // Signature huyml.co colors (#ececec canvas + #f24e42 coral red accent)
    expect(html.toLowerCase()).toContain("#ececec");
    expect(html.toLowerCase()).toContain("#f24e42");
  });

  test("uses Jolie Anh name, all-English copy, no audio effects, and no coffee widget", () => {
    const html = readFileSync(htmlPath, "utf8");

    expect(html).toContain("Jolie Anh");
    expect(html).toContain("JOLIE ANH");
    expect(html).not.toMatch(/\bAnh Jolie\b/i);

    // No Vietnamese leftovers
    expect(html.toLowerCase()).not.toContain("tham khảo");
    expect(html.toLowerCase()).not.toContain("thổ cẩm");
    expect(html.toLowerCase()).not.toContain("dốc mơ");

    // No sound effects or audio playback
    expect(html).not.toContain("new Audio");
    expect(html).not.toContain("AudioContext");
    expect(html).not.toMatch(/\.mp3|\.wav/i);

    // No Buy me a coffee
    expect(html.toLowerCase()).not.toContain("buy me a coffee");
  });

  test("includes all 4 huyml.co views (WORK 3D wheel, ABOUT + Process modal, PLAYGROUND 24 archive, CONTACT floating cards)", () => {
    const html = readFileSync(htmlPath, "utf8");

    // Top 5-column header & navigation
    expect(html).toContain('data-nav="work"');
    expect(html).toContain('data-nav="about"');
    expect(html).toContain('data-nav="playground"');
    expect(html).toContain('data-nav="contact"');

    // WORK view: 3D tilted card stack + metadata + giant counter + right wheel list & color swatches
    expect(html).toContain('id="viewWork"');
    expect(html).toContain('id="wheelStack"');
    expect(html).toContain('id="wheelList"');
    expect(html).toContain('id="wheelSwatches"');
    expect(html).toContain('id="workIndexCounter"');

    // ABOUT view: giant 19 / 99 background numbers, portrait, coral-red manifestos, 4-column bottom grid, and APPROACH & PROCESS sheet
    expect(html).toContain('id="viewAbout"');
    expect(html).toContain("APPROACH &amp; PROCESS");
    expect(html).toContain('id="processModal"');
    expect(html).toContain("Process &amp; Approach");

    // PLAYGROUND view: giant 24 watermark + 4-column masonry archive grid
    expect(html).toContain('id="viewPlayground"');
    expect(html).toContain('id="playgroundGrid"');

    // CONTACT overlay: COME SAY HI dark tilted card + CREDITS light tilted card
    expect(html).toContain('id="contactOverlay"');
    expect(html).toContain("COME SAY HI");
    expect(html).toContain("CREDITS");
  });

  test("includes Project Detail lookbook sheet with iPhone-native cubic-bezier(0.32, 0.72, 0, 1) and swipe-down gesture", () => {
    const html = readFileSync(htmlPath, "utf8");

    expect(html).toContain('id="projectSheetBackdrop"');
    expect(html).toContain('id="projectSheet"');
    expect(html).toContain('id="sheetFrames"');
    expect(html).toContain('id="sheetThumbStrip"');
    expect(html).toContain('id="sheetGiantTitle"');
    expect(html).toContain("cubic-bezier(0.32, 0.72, 0, 1)");
    expect(html).toContain("translate3d");
    expect(html).toContain("setupSheetPullDownToClose");
  });

  test("includes huyml-style character curtain-push intro animation and native mobile drawer", () => {
    const html = readFileSync(htmlPath, "utf8");

    // Intro animation elements & anime pusher created from Jolie Anh's portrait
    expect(html).toContain('id="introOverlay"');
    expect(html).toContain('id="introCurtain"');
    expect(html).toContain('id="introPusher"');
    expect(html).toContain('id="introAnimeChar"');
    expect(html).toContain("PUSH_FRAMES");
    expect(html).toContain("assets/jolie-push-frame-0.png");
    expect(html).toContain("heavyPushEase");

    // Native mobile header & drawer (no clunky pill row)
    expect(html).toContain('id="mobileMenuBtn"');
    expect(html).toContain('id="mobileMenuDrawer"');
  });

  test("uses widescreen 16:9 horizontal rectangle cards with pure vertical cylinder 3D curvature and no badge overlays", () => {
    const html = readFileSync(htmlPath, "utf8");

    // Widescreen 16:9 rectangle geometry
    expect(html).toContain("clamp(480px, 46vw, 620px)");
    expect(html).toContain("clamp(270px, 25.875vw, 348.75px)");

    // Clean unadorned cards without overlay badge pill
    expect(html).not.toContain("wheel-card-badge");

    // Pure vertical cylinder (Three.js style: rotateX with depth shading, zero diagonal skew)
    expect(html).toContain("rotateX(");
    expect(html).toContain("brightness(");
    expect(html).toContain("contrast(");
  });

  test("animates anime pusher with slow, heavy physical walk cadence and labored heave", () => {
    const html = readFileSync(htmlPath, "utf8");

    // Slow heavy walk cadence: 400ms static friction, 280ms sustained push
    expect(html).toContain("p < 0.22 ? 400 : (p < 0.85 ? 280 : 210)");
    expect(html).toContain("Math.sin(elapsed / 185)");
  });

  test("restricts card scrolling strictly one card at a time with debounced wheel lock and clamped touch drag", () => {
    const html = readFileSync(htmlPath, "utf8");

    // Desktop wheel locked debounce (blocks trailing trackpad momentum events)
    expect(html).toContain("isWheelLocked");
    expect(html).toContain("wheelUnlockTimer");

    // Touch & pointer single-card snap (clamped deflection + strict +/- 1 card advance)
    expect(html).toContain("dragStartWheelIndex");
    expect(html).toContain("Math.max(-0.65, Math.min(0.65, -totalDY / 320))");
  });

  test("supports swipe-right sheet dismissal with history pushState/popstate guard to return to scrolling screen without 2-back", () => {
    const html = readFileSync(htmlPath, "utf8");

    // History state guard preventing 2-back
    expect(html).toContain('history.pushState({ modal: "project-sheet"');
    expect(html).toContain('addEventListener("popstate"');
    expect(html).toContain("closeProjectSheet(false)");

    // Horizontal swipe-right gesture detection on sheet
    expect(html).toContain("isSwipingRight");
    expect(html).toContain("translate3d");
  });
});

