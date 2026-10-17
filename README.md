# Jolie Anh — Portfolio (huyml.co Editorial Direction)

> High-Fashion Beauty Retouching, Resort Lookbooks & Brand Identity Systems.  
> Crafted for **Jolie Anh** (Retoucher & Graphic Designer based in Ho Chi Minh City, Vietnam).

Live Showcase: **[https://hunghoni.github.io/jolie-anh-huyml/](https://hunghoni.github.io/jolie-anh-huyml/)**

---

## Visual Architecture & Aesthetic (Inspired by huyml.co)

- **Signature Typography**: BT Glyphius (flared display serif), BT Grotesk (neo-grotesk), and F37 Bolton (editorial numerals).
- **Color Palette**: `#ECECEC` warm canvas, `#111111` ink, and signature `#F24E42` coral-red editorial accents.
- **Interactive Views**:
  1. **WORK (`/`)**: 3D curved vertical card stack with perspective cylinder physics, left synced metadata, giant `01 / 08` counter, and right-rail wheel list with live 3-color palette swatches.
  2. **PROJECT DETAIL SHEET**: In-page lookbook viewer with sticky metadata column, high-res vertical frames, raw vs. retouched compare toggle, right jump strip, giant coral-red title, and native iPhone pull-down-to-close gesture with `cubic-bezier(0.32, 0.72, 0, 1)` physics.
  3. **ABOUT (`/about`)**: Giant white `19` and `99` background watermarks flanking Jolie Anh's portrait, mode toggles, coral-red manifestos, 4-column editorial grid, and interactive **`Process & Approach`** tilted frosted sheet.
  4. **PLAYGROUND (`/playground`)**: Giant white `24` watermark + 4-column archive grid of 24 retouching studies, skin tests, and moodboards.
  5. **CONTACT (`/contact`)**: Two floating tilted cards (`COME SAY HI` dark card + `CREDITS` light card).

---

## Verification & Testing

```bash
bun test
```
All 4 test suites pass (43 assertions).
