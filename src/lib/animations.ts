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
