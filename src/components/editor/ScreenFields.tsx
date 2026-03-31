"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { type Screen, SCREEN_FIELDS, SCREEN_TYPE_META } from "@/types";

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
  const fields = SCREEN_FIELDS[screen.type];
  const meta = SCREEN_TYPE_META[screen.type];

  const handleDataChange = (key: string, value: string) => {
    onUpdate(screen.id, {
      data: { ...screen.data, [key]: value },
    });
  };

  const durationSeconds = (screen.durationInFrames / 30).toFixed(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {meta.label} Screen
        </span>
      </div>

      {fields.map((field) => (
        <Field key={field.key} label={field.label}>
          <Input
            value={screen.data[field.key] ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => handleDataChange(field.key, e.target.value)}
          />
        </Field>
      ))}

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
