// Pure computation core for pixel-reveal effect.
// Ported from ship-img-reveal — no React/DOM dependencies.

export interface GridLeaf {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  avg: [number, number, number];
  isBg?: boolean;
}

export interface RevealGridConfig {
  minBlockSize: number;
  maxBlockSize: number;
  bgCutoff: number;
  noiseScale: number;
  noiseStrength: number;
  noiseSeed: number;
}

// --- Seeded PRNG (Mulberry32) ---

export function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Simplex Noise 3D ---

const GRAD3: [number, number, number][] = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

export class SimplexNoise {
  private perm = new Uint8Array(512);
  private permMod12 = new Uint8Array(512);

  constructor(seed: number) {
    const rng = mulberry32(seed);
    const p: number[] = [];
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  noise3(x: number, y: number, z: number): number {
    const F3 = 1 / 3;
    const G3 = 1 / 6;
    const PERM = this.perm;
    const PERM_MOD12 = this.permMod12;

    const s = (x + y + z) * F3;
    const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = x - X0, y0 = y - Y0, z0 = z - Z0;

    let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;
    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 > 0) { t0 *= t0; const gi = PERM_MOD12[ii + PERM[jj + PERM[kk]]]; n0 = t0 * t0 * (GRAD3[gi][0] * x0 + GRAD3[gi][1] * y0 + GRAD3[gi][2] * z0); }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 > 0) { t1 *= t1; const gi = PERM_MOD12[ii + i1 + PERM[jj + j1 + PERM[kk + k1]]]; n1 = t1 * t1 * (GRAD3[gi][0] * x1 + GRAD3[gi][1] * y1 + GRAD3[gi][2] * z1); }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 > 0) { t2 *= t2; const gi = PERM_MOD12[ii + i2 + PERM[jj + j2 + PERM[kk + k2]]]; n2 = t2 * t2 * (GRAD3[gi][0] * x2 + GRAD3[gi][1] * y2 + GRAD3[gi][2] * z2); }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 > 0) { t3 *= t3; const gi = PERM_MOD12[ii + 1 + PERM[jj + 1 + PERM[kk + 1]]]; n3 = t3 * t3 * (GRAD3[gi][0] * x3 + GRAD3[gi][1] * y3 + GRAD3[gi][2] * z3); }

    return 32 * (n0 + n1 + n2 + n3);
  }
}

// --- Region Stats ---

export interface RegionStats {
  avg: [number, number, number];
  avgAlpha: number;
  variance: number;
}

export function getRegionStats(
  imageData: ImageData,
  x: number,
  y: number,
  w: number,
  h: number,
): RegionStats {
  const d = imageData.data;
  const imgW = imageData.width;
  const step = Math.max(1, Math.floor(Math.min(w, h) / 12));
  const x1 = Math.floor(x), y1 = Math.floor(y);
  const x2 = Math.min(Math.floor(x + w), imgW);
  const y2 = Math.min(Math.floor(y + h), imageData.height);

  let rSum = 0, gSum = 0, bSum = 0, aSum = 0;
  let rSq = 0, gSq = 0, bSq = 0;
  let count = 0;

  for (let py = y1; py < y2; py += step) {
    for (let px = x1; px < x2; px += step) {
      const i = (py * imgW + px) * 4;
      const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
      rSum += r; gSum += g; bSum += b; aSum += a;
      rSq += r * r; gSq += g * g; bSq += b * b;
      count++;
    }
  }

  if (count === 0) return { avg: [0, 0, 0], avgAlpha: 0, variance: 0 };

  const rAvg = rSum / count, gAvg = gSum / count, bAvg = bSum / count;
  return {
    avg: [Math.round(rAvg), Math.round(gAvg), Math.round(bAvg)],
    avgAlpha: aSum / count,
    variance: (rSq / count - rAvg * rAvg) + (gSq / count - gAvg * gAvg) + (bSq / count - bAvg * bAvg),
  };
}

// --- Grid Building ---

export function buildGrid(
  imageData: ImageData,
  config: RevealGridConfig,
  threshMin: number,
  threshMax: number,
  noiseTime: number,
  useNoise: boolean,
): GridLeaf[] {
  const { maxBlockSize } = config;
  const cols = Math.ceil(imageData.width / maxBlockSize);
  const rows = Math.ceil(imageData.height / maxBlockSize);
  const noise = useNoise ? new SimplexNoise(config.noiseSeed) : null;
  const leaves: GridLeaf[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * maxBlockSize;
      const y = r * maxBlockSize;
      const s = Math.min(maxBlockSize, imageData.width - x, imageData.height - y);
      subdivideSquare(imageData, x, y, s, s, 0, config, threshMin, threshMax, useNoise, noise, noiseTime, leaves);
    }
  }

  return leaves;
}

function subdivideSquare(
  imageData: ImageData,
  x: number, y: number, w: number, h: number,
  depth: number,
  config: RevealGridConfig,
  threshMin: number, threshMax: number,
  useNoise: boolean,
  noise: SimplexNoise | null,
  noiseTime: number,
  leaves: GridLeaf[],
): void {
  const size = Math.min(w, h);
  const stats = getRegionStats(imageData, x, y, w, h);

  if (stats.avgAlpha < 1) return;

  if (config.bgCutoff > 0) {
    const brightness = (stats.avg[0] + stats.avg[1] + stats.avg[2]) / 3;
    if (brightness <= config.bgCutoff) {
      leaves.push({ x, y, w, h, depth, avg: stats.avg, isBg: true });
      return;
    }
  }

  const mid = (threshMin + threshMax) / 2;
  const halfRange = (threshMax - threshMin) / 2;
  let threshold: number;
  if (useNoise && noise) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const n = noise.noise3(cx / config.noiseScale, cy / config.noiseScale, noiseTime);
    threshold = mid + n * halfRange * config.noiseStrength;
  } else {
    threshold = mid;
  }

  const shouldSubdivide = size > config.maxBlockSize || (stats.variance > threshold && size > config.minBlockSize);

  if (shouldSubdivide && size >= config.minBlockSize * 2) {
    const hs = size / 2;
    subdivideSquare(imageData, x, y, hs, hs, depth + 1, config, threshMin, threshMax, useNoise, noise, noiseTime, leaves);
    subdivideSquare(imageData, x + hs, y, hs, hs, depth + 1, config, threshMin, threshMax, useNoise, noise, noiseTime, leaves);
    subdivideSquare(imageData, x, y + hs, hs, hs, depth + 1, config, threshMin, threshMax, useNoise, noise, noiseTime, leaves);
    subdivideSquare(imageData, x + hs, y + hs, hs, hs, depth + 1, config, threshMin, threshMax, useNoise, noise, noiseTime, leaves);
  } else {
    leaves.push({ x, y, w, h, depth, avg: stats.avg });
  }
}

export type ThreshFn = (cx: number, cy: number) => { threshMin: number; threshMax: number } | null;

export function buildGridLocal(
  imageData: ImageData,
  config: RevealGridConfig,
  threshFn: ThreshFn,
): GridLeaf[] {
  const { maxBlockSize } = config;
  const cols = Math.ceil(imageData.width / maxBlockSize);
  const rows = Math.ceil(imageData.height / maxBlockSize);
  const leaves: GridLeaf[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * maxBlockSize;
      const y = r * maxBlockSize;
      const s = Math.min(maxBlockSize, imageData.width - x, imageData.height - y);
      subdivideSquareLocal(imageData, x, y, s, s, 0, config, threshFn, leaves);
    }
  }
  return leaves;
}

function subdivideSquareLocal(
  imageData: ImageData,
  x: number, y: number, w: number, h: number,
  depth: number,
  config: RevealGridConfig,
  threshFn: ThreshFn,
  leaves: GridLeaf[],
): void {
  const size = Math.min(w, h);
  const cx = x + w / 2, cy = y + h / 2;

  const tResult = threshFn(cx, cy);
  if (tResult === null) return;

  const stats = getRegionStats(imageData, x, y, w, h);
  if (stats.avgAlpha < 1) return;

  if (config.bgCutoff > 0) {
    const brightness = (stats.avg[0] + stats.avg[1] + stats.avg[2]) / 3;
    if (brightness <= config.bgCutoff) {
      leaves.push({ x, y, w, h, depth, avg: stats.avg, isBg: true });
      return;
    }
  }

  const threshold = (tResult.threshMin + tResult.threshMax) / 2;
  const shouldSubdivide = size > config.maxBlockSize || (stats.variance > threshold && size > config.minBlockSize);

  if (shouldSubdivide && size >= config.minBlockSize * 2) {
    const hs = size / 2;
    subdivideSquareLocal(imageData, x, y, hs, hs, depth + 1, config, threshFn, leaves);
    subdivideSquareLocal(imageData, x + hs, y, hs, hs, depth + 1, config, threshFn, leaves);
    subdivideSquareLocal(imageData, x, y + hs, hs, hs, depth + 1, config, threshFn, leaves);
    subdivideSquareLocal(imageData, x + hs, y + hs, hs, hs, depth + 1, config, threshFn, leaves);
  } else {
    leaves.push({ x, y, w, h, depth, avg: stats.avg });
  }
}
