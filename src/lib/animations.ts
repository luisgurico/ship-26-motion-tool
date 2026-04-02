import { interpolate, spring, Easing } from "remotion";

export function fadeIn(frame: number, delay = 0, duration = 20) {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function fadeOut(frame: number, start: number, duration = 20) {
  return interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function slideUp(frame: number, delay = 0, distance = 40, duration = 25) {
  return interpolate(frame, [delay, delay + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

export function slideIn(
  frame: number,
  direction: "left" | "right" | "up" | "down" = "left",
  delay = 0,
  distance = 60,
  duration = 25
) {
  const value = interpolate(frame, [delay, delay + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  switch (direction) {
    case "left":
      return { x: -value, y: 0 };
    case "right":
      return { x: value, y: 0 };
    case "up":
      return { x: 0, y: -value };
    case "down":
      return { x: 0, y: value };
  }
}

export function scaleIn(frame: number, fps: number, delay = 0) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });
}

export function typewriter(text: string, frame: number, charsPerFrame = 0.5) {
  const chars = Math.floor(frame * charsPerFrame);
  return text.slice(0, Math.min(chars, text.length));
}

/**
 * Deterministic shuffle using a simple seeded PRNG.
 * Returns an array of indices in shuffled order.
 */
function seededShuffle(length: number, seed: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  let s = seed;
  const next = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  // Fisher-Yates
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

/**
 * Returns a boolean array indicating which characters are visible at the given frame.
 * direction "in": characters appear randomly over `duration` frames starting at `delay`.
 * direction "out": characters disappear randomly over `duration` frames starting at `delay`.
 */
export function characterDissolve(
  text: string,
  frame: number,
  delay: number,
  duration: number,
  direction: "in" | "out",
  seed = 42,
): boolean[] {
  const len = text.length;
  if (len === 0) return [];

  const order = seededShuffle(len, seed + len);
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const charsRevealed = Math.round(progress * len);

  const visible = new Array<boolean>(len).fill(direction === "out");
  for (let i = 0; i < charsRevealed; i++) {
    visible[order[i]] = direction === "in";
  }
  return visible;
}
