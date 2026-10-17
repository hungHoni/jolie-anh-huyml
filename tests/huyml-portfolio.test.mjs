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

    // Intro animation elements & Lottie pusher
    expect(html).toContain('id="introOverlay"');
    expect(html).toContain('id="introCurtain"');
    expect(html).toContain('id="introPusher"');
    expect(html).toContain("push-lottie.json");

    // Native mobile header & drawer (no clunky pill row)
    expect(html).toContain('id="mobileMenuBtn"');
    expect(html).toContain('id="mobileMenuDrawer"');
  });
});
