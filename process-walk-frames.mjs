import { chromium } from "/Users/q/.claude/skills/gstack/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

export async function processWalkSheet(inputPath, outputDir) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const base64 = fs.readFileSync(inputPath).toString("base64");

  const frames = await page.evaluate(async (b64) => {
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = "data:image/jpeg;base64," + b64; });
    const w = img.width;
    const h = img.height;

    // 2x2 Quadrants
    const midX = Math.floor(w / 2);
    const midY = Math.floor(h / 2);

    const quads = [
      { name: "walk-0", sx: 0, sy: 0, sw: midX, sh: midY },
      { name: "walk-1", sx: midX, sy: 0, sw: w - midX, sh: midY },
      { name: "walk-2", sx: 0, sy: midY, sw: midX, sh: h - midY },
      { name: "walk-3", sx: midX, sy: midY, sw: w - midX, sh: h - midY }
    ];

    const results = [];

    for (const q of quads) {
      const c = document.createElement("canvas");
      c.width = q.sw;
      c.height = q.sh;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, q.sx, q.sy, q.sw, q.sh, 0, 0, q.sw, q.sh);

      const id = ctx.getImageData(0, 0, q.sw, q.sh);
      const d = id.data;

      // Find bounding box of non-white pixels
      let minX = q.sw, maxX = 0, minY = q.sh, maxY = 0;
      for (let y = 0; y < q.sh; y++) {
        for (let x = 0; x < q.sw; x++) {
          const idx = (y * q.sw + x) * 4;
          const r = d[idx], g = d[idx + 1], b = d[idx + 2];
          if (r < 240 || g < 240 || b < 240) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX <= minX || maxY <= minY) {
        continue;
      }

      // Crop to content with 4px padding
      const pad = 4;
      const cropX = Math.max(0, minX - pad);
      const cropY = Math.max(0, minY - pad);
      const cropW = Math.min(q.sw - cropX, (maxX - minX + 1) + pad * 2);
      const cropH = Math.min(q.sh - cropY, (maxY - minY + 1) + pad * 2);

      const cCrop = document.createElement("canvas");
      cCrop.width = cropW;
      cCrop.height = cropH;
      const ctxCrop = cCrop.getContext("2d");
      ctxCrop.drawImage(c, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      // Make pure white transparent
      const cropId = ctxCrop.getImageData(0, 0, cropW, cropH);
      const cData = cropId.data;

      for (let i = 0; i < cropW * cropH; i++) {
        const idx = i * 4;
        const r = cData[idx];
        const g = cData[idx + 1];
        const b = cData[idx + 2];
        const brightness = (r + g + b) / 3;

        if (brightness > 248) {
          cData[idx + 3] = 0;
        } else if (brightness > 230) {
          const alpha = 1 - (brightness - 230) / 18;
          cData[idx + 3] = Math.round(cData[idx + 3] * alpha);
        }
      }

      ctxCrop.putImageData(cropId, 0, 0);

      results.push({
        name: q.name,
        width: cropW,
        height: cropH,
        dataUrl: cCrop.toDataURL("image/png")
      });
    }

    return results;
  }, base64);

  await browser.close();

  const savedFiles = [];
  for (const f of frames) {
    const dest = path.join(outputDir, `${f.name}.png`);
    const buf = Buffer.from(f.dataUrl.split(",")[1], "base64");
    fs.writeFileSync(dest, buf);
    savedFiles.push(dest);
    console.log(`Saved ${dest} (${f.width}x${f.height})`);
  }

  return savedFiles;
}

if (process.argv[2]) {
  processWalkSheet(process.argv[2], process.argv[3] || "./assets")
    .then(files => console.log("Done! Processed:", files))
    .catch(err => console.error("Error:", err));
}
