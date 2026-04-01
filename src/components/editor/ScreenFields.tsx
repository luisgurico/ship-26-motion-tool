"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Screen } from "@/types";

interface ScreenFieldsProps {
  screen: Screen;
  onUpdate: (id: string, patch: Partial<Screen>) => void;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export const ScreenFields: React.FC<ScreenFieldsProps> = ({
  screen,
  onUpdate,
}) => {
  const durationSeconds = (screen.durationInFrames / 30).toFixed(1);

  return (
    <div className="flex flex-col gap-4">
      <Field label="Screen Name">
        <Input
          value={screen.name}
          onChange={(e) => onUpdate(screen.id, { name: e.target.value })}
        />
      </Field>

      <Field label="Content">
        <Input
          value={screen.content}
          onChange={(e) => onUpdate(screen.id, { content: e.target.value })}
        />
      </Field>

      <div className="border-t border-border pt-4 mt-2" />

      <Field label={`Duration: ${durationSeconds}s`}>
        <Slider
          value={[screen.durationInFrames]}
          onValueChange={([v]) =>
            onUpdate(screen.id, { durationInFrames: v })
          }
          min={30}
          max={180}
          step={15}
        />
      </Field>
    </div>
  );
};
