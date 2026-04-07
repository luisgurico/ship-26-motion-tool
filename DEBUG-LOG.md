# Debug Log: Dev Server Crash on Page Load

## Date: 2026-04-07

## Problem
Running `npm run dev` and opening localhost caused the laptop to freeze — fans ramped up, page never loaded. Started happening after the pixel-reveal feature was added (commit `5e8d84d`).

## Root Cause Analysis

### What was added in the last commit
- `src/lib/pixel-reveal/engine.ts` — recursive grid subdivision + simplex noise (290 lines)
- `src/lib/pixel-reveal/renderer.ts` — canvas rendering with per-frame grid rebuilds (304 lines)
- `src/remotion/elements/ImageReveal.tsx` — runs the pixel-reveal engine inside Remotion on every frame
- Total: ~1,000 lines of CPU-heavy rendering code

### Why it crashes the browser
1. **Two Remotion compositions render simultaneously** on the main page:
   - `EditorViewport` uses `<Thumbnail>` (renders one frame — lightweight)
   - `PreviewPanel` uses `<Player>` with `autoPlay` + `loop` (renders ALL frames continuously)
2. The Player auto-plays immediately on page load, rendering every frame of every screen
3. Screen 3 ("Speaker") has a 1.4MB image (`guillermo-rauch.png`)
4. If a saved preset in localStorage has `reveal.enabled: true`, the pixel-reveal engine runs on every frame — doing recursive subdivision, simplex noise, and canvas compositing
5. `--turbopack` (experimental bundler) adds extra memory pressure during compilation

### Key files involved
- `src/components/editor/PreviewPanel.tsx` — the auto-playing Remotion Player
- `src/components/editor/EditorViewport.tsx` — the static Thumbnail (not the problem)
- `src/remotion/elements/ImageReveal.tsx` — the pixel-reveal Remotion element
- `src/lib/pixel-reveal/renderer.ts` — `renderRevealFrame()` called on every frame
- `src/app/page.tsx` — mounts both panels side by side

## Changes Made

### Fix 1: Removed `--turbopack` from dev script
- **File:** `package.json`
- **Before:** `"dev": "next dev --turbopack -p 3630"`
- **After:** `"dev": "next dev -p 3630"`
- **Why:** Turbopack uses more memory during compilation; standard webpack is more stable

### Fix 2: Disabled autoPlay on Preview Player
- **File:** `src/components/editor/PreviewPanel.tsx`
- **Before:** `useState(true)` + `autoPlay` prop on Player
- **After:** `useState(false)` + removed `autoPlay`
- **Why:** Prevents the Remotion Player from rendering all frames the instant the page loads. User can press play when ready.

## If It Still Crashes

### Things to try next
1. **Clear localStorage** — a saved preset may have `reveal.enabled: true` which triggers the heavy pixel-reveal engine even on the Thumbnail. Open browser console and run: `localStorage.clear()`
2. **Check if the image is too large** — `guillermo-rauch.png` is 1.4MB. Could downscale it.
3. **Add frame-skipping** to `ImageReveal.tsx` — only re-render the canvas every N frames instead of every frame
4. **Lazy-load the pixel-reveal engine** — don't import it until `reveal.enabled` is true
5. **Move pixel-reveal to a Web Worker** — offload the heavy computation off the main thread
6. **Reduce composition resolution** — the Player renders at full `compositionWidth/Height` (1080x1080 for square). Could render preview at lower res.

## Environment
- Node: v24.14.0
- Next.js: 16.2.1
- Remotion: 4.0.442
- macOS Darwin 25.3.0
