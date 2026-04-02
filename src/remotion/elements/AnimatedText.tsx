import React from "react";
import { useCurrentFrame } from "remotion";
import { characterDissolve } from "@/lib/animations";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  outDelay?: number;
  duration?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 5,
  outDelay,
  duration = 15,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  const inVisible = characterDissolve(text, frame, delay, duration, "in", 42);
  const outVisible = outDelay != null
    ? characterDissolve(text, frame, outDelay, duration, "out", 137)
    : null;

  return (
    <div className={className} style={style}>
      {text.split("").map((char, i) => {
        if (char === "\n") return <br key={i} />;
        const showIn = inVisible[i];
        const showOut = outVisible ? outVisible[i] : true;
        const visible = showIn && showOut;

        return (
          <span
            key={i}
            style={{ visibility: visible ? "visible" : "hidden" }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
