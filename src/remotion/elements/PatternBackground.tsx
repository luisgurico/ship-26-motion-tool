import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { interpolate } from "remotion";

interface PatternBackgroundProps {
  pattern: "dots" | "grid" | "lines" | "waves" | "none";
  color: string;
  backgroundColor: string;
  opacity?: number;
}

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  pattern,
  color,
  backgroundColor,
  opacity = 0.15,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const renderPattern = () => {
    switch (pattern) {
      case "dots":
        return (
          <svg width={width} height={height}>
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="15" cy="15" r="2" fill={color} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        );
      case "grid":
        return (
          <svg width={width} height={height}>
            <defs>
              <pattern
                id="grid"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        );
      case "lines": {
        const offset = interpolate(frame, [0, 300], [0, 40], {
          extrapolateRight: "extend",
        });
        return (
          <svg width={width} height={height}>
            <defs>
              <pattern
                id="lines"
                x={offset}
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="20"
                  stroke={color}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lines)" />
          </svg>
        );
      }
      case "waves": {
        const waveOffset = interpolate(frame, [0, 300], [0, 100], {
          extrapolateRight: "extend",
        });
        return (
          <svg width={width} height={height}>
            <defs>
              <pattern
                id="waves"
                x={waveOffset}
                y="0"
                width="60"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 15 Q 15 0 30 15 Q 45 30 60 15"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        );
      }
      case "none":
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor,
        overflow: "hidden",
      }}
    >
      <div style={{ opacity }}>{renderPattern()}</div>
    </div>
  );
};
