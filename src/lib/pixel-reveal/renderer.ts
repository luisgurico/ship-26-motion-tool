// Canvas rendering functions for pixel-reveal effect.
// Pure functions — no React/DOM dependencies beyond CanvasRenderingContext2D.

import type { GridLeaf, RevealGridConfig, ThreshFn } from "./engine";
import { buildGrid, buildGridLocal, mulberry32 } from "./engine";
import type { ImageRevealConfig } from "@/types";

export interface RenderConfig {
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidthLarge: number;
  strokeWidthSmall: number;
  borderEnabled: boolean;
  borderInset: number;
  minBlockSize: number;
  maxBlockSize: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

// --- Leaf Rendering ---

export function renderLeaves(
  ctx: CanvasRenderingContext2D,
  leaves: GridLeaf[],
  rc: RenderConfig,
  clearCanvas: boolean = true,
): void {
  const inset = rc.borderEnabled ? rc.borderInset : 0;
  const minSize = rc.minBlockSize;
  const maxSize = Math.max(minSize * 2, rc.maxBlockSize);

  if (clearCanvas) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  // Fill pass
  for (const leaf of leaves) {
    if (leaf.isBg) continue;
    const [r, g, b] = leaf.avg;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(
      Math.floor(leaf.x) + inset,
      Math.floor(leaf.y) + inset,
      Math.ceil(leaf.w) - inset * 2,
      Math.ceil(leaf.h) - inset * 2,
    );
  }

  // Stroke pass
  if (rc.strokeEnabled) {
    ctx.strokeStyle = rc.strokeColor;
    for (const leaf of leaves) {
      if (leaf.isBg) continue;
      const t = Math.min(1, Math.max(0, (leaf.w - minSize) / (maxSize - minSize)));
      const sw = rc.strokeWidthSmall + (rc.strokeWidthLarge - rc.strokeWidthSmall) * t;
      if (sw <= 0) continue;
      ctx.lineWidth = sw;
      const fx = Math.floor(leaf.x) + inset + 0.5;
      const fy = Math.floor(leaf.y) + inset + 0.5;
      const fw = Math.ceil(leaf.w) - inset * 2 - 1;
      const fh = Math.ceil(leaf.h) - inset * 2 - 1;
      ctx.strokeRect(fx, fy, fw, fh);
    }
  }
}

export function renderLeavesOver(
  ctx: CanvasRenderingContext2D,
  leaves: GridLeaf[],
  rc: RenderConfig,
  includeBg: boolean = false,
): void {
  const inset = rc.borderEnabled ? rc.borderInset : 0;
  const minSize = rc.minBlockSize;
  const maxSize = Math.max(minSize * 2, rc.maxBlockSize);

  for (const leaf of leaves) {
    if (leaf.isBg && !includeBg) continue;
    const [r, g, b] = leaf.avg;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(
      Math.floor(leaf.x) + inset,
      Math.floor(leaf.y) + inset,
      Math.ceil(leaf.w) - inset * 2,
      Math.ceil(leaf.h) - inset * 2,
    );
  }

  if (rc.strokeEnabled) {
    ctx.strokeStyle = rc.strokeColor;
    for (const leaf of leaves) {
      if (leaf.isBg) continue;
      const t = Math.min(1, Math.max(0, (leaf.w - minSize) / (maxSize - minSize)));
      const sw = rc.strokeWidthSmall + (rc.strokeWidthLarge - rc.strokeWidthSmall) * t;
      if (sw <= 0) continue;
      ctx.lineWidth = sw;
      const fx = Math.floor(leaf.x) + inset + 0.5;
      const fy = Math.floor(leaf.y) + inset + 0.5;
      const fw = Math.ceil(leaf.w) - inset * 2 - 1;
      const fh = Math.ceil(leaf.h) - inset * 2 - 1;
      ctx.strokeRect(fx, fy, fw, fh);
    }
  }
}

// --- Clip helper ---

function clipLeaves(ctx: CanvasRenderingContext2D, leaves: GridLeaf[]): void {
  ctx.beginPath();
  for (const leaf of leaves) {
    ctx.rect(Math.floor(leaf.x), Math.floor(leaf.y), Math.ceil(leaf.w), Math.ceil(leaf.h));
  }
  ctx.clip();
}

// --- Main reveal frame renderer ---

export function renderRevealFrame(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  tempCanvas: HTMLCanvasElement,
  config: ImageRevealConfig,
  frozenLeaves: GridLeaf[],
  seedMap: Map<string, number>,
  cellSeeds: Map<string, number>,
  progress: number, // 0..1
): void {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const isOut = config.direction === "out";
  const mode = config.wipeMode;

  const overlapFrac = config.overlapPercent / 100;
  // Normalize: phase1 runs 0..0.5+overlap/2, phase2 runs 0.5-overlap/2..1
  // Map progress to inProgress and unpixProgress
  const phaseDuration = 1 / (2 - overlapFrac);
  const unpixStartProgress = phaseDuration * (1 - overlapFrac);
  const totalPhase = unpixStartProgress + phaseDuration;

  let inProgress: number, unpixProgress: number;
  if (isOut) {
    unpixProgress = 1 - Math.min(progress / phaseDuration, 1);
    inProgress = 1 - Math.max(0, Math.min((progress - unpixStartProgress) / phaseDuration, 1));
  } else {
    inProgress = Math.min(progress / phaseDuration, 1);
    unpixProgress = Math.max(0, Math.min((progress - unpixStartProgress) / phaseDuration, 1));
  }

  const softZone = config.softZone;
  const waveGap = config.waveGap;

  const minSize = config.minBlockSize;
  const maxSize = Math.max(minSize * 2, config.maxBlockSize);
  const finalThreshMin = (101 - config.sensitivityMax) * 50;
  const finalThreshMax = (101 - config.sensitivityMin) * 50;
  const finalMid = (finalThreshMin + finalThreshMax) / 2;
  const hiThresh = 0;

  const gapFrac = mode === "random" ? 0.15 + (waveGap / 400) * 0.4 : 0;

  const rc: RenderConfig = {
    strokeEnabled: config.strokeEnabled,
    strokeColor: config.strokeColor,
    strokeWidthLarge: config.strokeWidthLarge,
    strokeWidthSmall: config.strokeWidthSmall,
    borderEnabled: config.borderEnabled,
    borderInset: config.borderInset,
    minBlockSize: minSize,
    maxBlockSize: maxSize,
  };

  // Black background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  // Determine visible leaves
  const visibleLeaves: GridLeaf[] = [];
  for (const leaf of frozenLeaves) {
    const key = `${leaf.x},${leaf.y},${leaf.w}`;
    const seed = seedMap.get(key)!;
    const cy = leaf.y + leaf.h / 2;

    let visible: boolean;
    if (mode === "linear") {
      const totalRange = h + softZone;
      const sweepY = -softZone / 2 + inProgress * totalRange;
      if (cy < sweepY - softZone / 2) {
        visible = true;
      } else if (cy > sweepY + softZone / 2) {
        visible = false;
      } else {
        const t = (sweepY + softZone / 2 - cy) / softZone;
        visible = seed < t;
      }
    } else {
      visible = inProgress >= seed;
    }

    if (visible) visibleLeaves.push(leaf);
  }

  if (visibleLeaves.length > 0) {
    // Layer 1: original image clipped to visible blocks
    ctx.save();
    clipLeaves(ctx, visibleLeaves);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();

    // Layer 2: pixelated overlay where not fully resolved
    if (unpixProgress < 1) {
      const gridConfig: RevealGridConfig = {
        minBlockSize: minSize,
        maxBlockSize: maxSize,
        bgCutoff: config.bgCutoff,
        noiseScale: config.noiseScale,
        noiseStrength: config.noiseStrength,
        noiseSeed: config.noiseSeed,
      };

      const getCellSeed = (cx: number, cy: number): number => {
        const key = `${Math.floor(cx)},${Math.floor(cy)}`;
        if (!cellSeeds.has(key)) {
          const rng = mulberry32(config.noiseSeed + 7777 + Math.floor(cx) * 1000 + Math.floor(cy));
          cellSeeds.set(key, rng());
        }
        return cellSeeds.get(key)!;
      };

      const threshFn: ThreshFn = (cx, cy) => {
        let completion: number;

        if (unpixProgress <= 0) {
          completion = 0;
        } else if (mode === "linear") {
          const totalRange = h + softZone + waveGap;
          const wavePos = -softZone / 2 - waveGap + unpixProgress * totalRange;
          completion = (wavePos - cy + softZone / 2 + waveGap) / (softZone + waveGap);
        } else {
          const cellT = getCellSeed(cx, cy);
          const activateAt = cellT * (1 - gapFrac);
          completion = (unpixProgress - activateAt) / gapFrac;
        }

        completion = Math.max(0, Math.min(1, completion));
        const pixelAmount = 1 - completion;

        if (pixelAmount <= 0) return null;

        const thresh = hiThresh + (finalMid - hiThresh) * pixelAmount;
        return { threshMin: thresh, threshMax: thresh };
      };

      const pixelLeaves = buildGridLocal(imageData, gridConfig, threshFn);

      if (pixelLeaves.length > 0) {
        ctx.save();
        clipLeaves(ctx, visibleLeaves);
        renderLeavesOver(ctx, pixelLeaves, rc, true);
        ctx.restore();
      }
    }
  }
}

// --- Pre-compute frozen grid and seed maps ---

export function prepareFrozenData(
  imageData: ImageData,
  config: ImageRevealConfig,
): {
  frozenLeaves: GridLeaf[];
  seedMap: Map<string, number>;
  cellSeeds: Map<string, number>;
} {
  const minSize = config.minBlockSize;
  const maxSize = Math.max(minSize * 2, config.maxBlockSize);
  const threshMin = (101 - config.sensitivityMax) * 50;
  const threshMax = (101 - config.sensitivityMin) * 50;

  const gridConfig: RevealGridConfig = {
    minBlockSize: minSize,
    maxBlockSize: maxSize,
    bgCutoff: config.bgCutoff,
    noiseScale: config.noiseScale,
    noiseStrength: config.noiseStrength,
    noiseSeed: config.noiseSeed,
  };

  const frozenLeaves = buildGrid(imageData, gridConfig, threshMin, threshMax, 0, false);

  const seedMap = new Map<string, number>();
  const rng = mulberry32(config.noiseSeed + 9999);
  for (const leaf of frozenLeaves) {
    const key = `${leaf.x},${leaf.y},${leaf.w}`;
    seedMap.set(key, rng());
  }

  return { frozenLeaves, seedMap, cellSeeds: new Map() };
}
