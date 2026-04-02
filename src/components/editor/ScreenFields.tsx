"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Screen, TextBox, TextJustification } from "@/types";
import { FONT_OPTIONS } from "@/lib/fonts";

interface ScreenFieldsProps {
  screen: Screen;
  selectedTextBoxId: string | null;
  onSelectTextBox: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<Screen>) => void;
  onTextBoxUpdate: (screenId: string, textBoxId: string, patch: Partial<TextBox>) => void;
  onTextBoxAdd: (screenId: string) => void;
  onTextBoxRemove: (screenId: string, textBoxId: string) => void;
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
  selectedTextBoxId,
  onSelectTextBox,
  onUpdate,
  onTextBoxUpdate,
  onTextBoxAdd,
  onTextBoxRemove,
}) => {
  const durationSeconds = (screen.durationInFrames / 30).toFixed(1);
  const selectedTextBox = screen.textBoxes.find((tb) => tb.id === selectedTextBoxId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <Field label="Screen Name">
        <Input
          value={screen.name}
          onChange={(e) => onUpdate(screen.id, { name: e.target.value })}
        />
      </Field>

      <div className="border-t border-border pt-4 mt-2" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Text Boxes</Label>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onTextBoxAdd(screen.id)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          {screen.textBoxes.map((tb) => (
            <div
              key={tb.id}
              className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs font-mono transition-colors ${
                tb.id === selectedTextBoxId
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => onSelectTextBox(tb.id)}
            >
              <span className="flex-1 truncate">{tb.content || "Empty"}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 shrink-0"
                disabled={screen.textBoxes.length <= 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onTextBoxRemove(screen.id, tb.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {selectedTextBox && (
        <>
          <div className="border-t border-border pt-4 mt-2" />

          <Field label="Content">
            <textarea
              value={selectedTextBox.content}
              onChange={(e) =>
                onTextBoxUpdate(screen.id, selectedTextBox.id, { content: e.target.value })
              }
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y font-mono"
            />
          </Field>

          <div className="flex flex-col gap-1.5">
            <Label>Justification</Label>
            <div className="flex gap-1">
              {(["left", "center", "right"] as TextJustification[]).map((j) => (
                <Button
                  key={j}
                  variant={selectedTextBox.justification === j ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() =>
                    onTextBoxUpdate(screen.id, selectedTextBox.id, { justification: j })
                  }
                >
                  {j === "left" && <AlignLeft className="h-3.5 w-3.5" />}
                  {j === "center" && <AlignCenter className="h-3.5 w-3.5" />}
                  {j === "right" && <AlignRight className="h-3.5 w-3.5" />}
                </Button>
              ))}
            </div>
          </div>

          <Field label="Font">
            <Select
              value={selectedTextBox.fontFamily}
              onValueChange={(v) =>
                onTextBoxUpdate(screen.id, selectedTextBox.id, { fontFamily: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label={`Font Size: ${selectedTextBox.fontSize}px`}>
            <Slider
              value={[selectedTextBox.fontSize]}
              onValueChange={([v]) =>
                onTextBoxUpdate(screen.id, selectedTextBox.id, { fontSize: v })
              }
              min={12}
              max={400}
              step={2}
            />
          </Field>

          <Field label={`Font Weight: ${selectedTextBox.fontWeight}`}>
            <Slider
              value={[selectedTextBox.fontWeight]}
              onValueChange={([v]) =>
                onTextBoxUpdate(screen.id, selectedTextBox.id, { fontWeight: v })
              }
              min={100}
              max={900}
              step={100}
            />
          </Field>

          <Field label={`Letter Spacing: ${selectedTextBox.letterSpacing}em`}>
            <Slider
              value={[selectedTextBox.letterSpacing]}
              onValueChange={([v]) =>
                onTextBoxUpdate(screen.id, selectedTextBox.id, { letterSpacing: v })
              }
              min={-0.2}
              max={0.5}
              step={0.01}
            />
          </Field>

          <Field label={`X Position: ${selectedTextBox.xPercent}%`}>
            <Slider
              value={[selectedTextBox.xPercent]}
              onValueChange={([v]) =>
                onTextBoxUpdate(screen.id, selectedTextBox.id, { xPercent: v })
              }
              min={0}
              max={100}
              step={5}
            />
          </Field>

          <Field label={`Y Position: ${selectedTextBox.yPercent}%`}>
            <Slider
              value={[selectedTextBox.yPercent]}
              onValueChange={([v]) =>
                onTextBoxUpdate(screen.id, selectedTextBox.id, { yPercent: v })
              }
              min={0}
              max={100}
              step={5}
            />
          </Field>
        </>
      )}

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
