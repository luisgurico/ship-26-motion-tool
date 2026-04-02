"use client";

import React, { useCallback, useRef, useState } from "react";
import type { TextBox } from "@/types";

interface DragOverlayProps {
  textBoxes: TextBox[];
  selectedTextBoxId: string | null;
  gridSize: number;
  snapEnabled: boolean;
  onSelectTextBox: (id: string | null) => void;
  onMoveTextBox: (id: string, xPercent: number, yPercent: number) => void;
  onUpdateContent: (id: string, content: string) => void;
  displayWidth: number;
  displayHeight: number;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({
  textBoxes,
  selectedTextBoxId,
  gridSize,
  snapEnabled,
  onSelectTextBox,
  onMoveTextBox,
  onUpdateContent,
  displayWidth,
  displayHeight,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragX, setDragX] = useState<number | null>(null);
  const [dragY, setDragY] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const gridStep = 100 / gridSize;

  function snap(val: number): number {
    if (!snapEnabled) return val;
    return Math.round(val / gridStep) * gridStep;
  }

  const getPercents = useCallback(
    (e: React.MouseEvent) => {
      const rect = overlayRef.current?.getBoundingClientRect();
      if (!rect) return { x: 50, y: 50 };
      return {
        x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
        y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
      };
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, tbId: string) => {
      if (editingId) return;
      e.preventDefault();
      onSelectTextBox(tbId);
      setDragId(tbId);
      const { x, y } = getPercents(e);
      setDragX(x);
      setDragY(y);
    },
    [onSelectTextBox, getPercents, editingId],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragId) return;
      const { x, y } = getPercents(e);
      setDragX(snap(x));
      setDragY(snap(y));
    },
    [dragId, getPercents, gridStep],
  );

  const handleMouseUp = useCallback(() => {
    if (dragId && dragX != null && dragY != null) {
      onMoveTextBox(dragId, snap(dragX), snap(dragY));
    }
    setDragId(null);
    setDragX(null);
    setDragY(null);
  }, [dragId, dragX, dragY, onMoveTextBox, gridStep]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent, tbId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setDragId(null);
      setEditingId(tbId);
      onSelectTextBox(tbId);
    },
    [onSelectTextBox],
  );

  const handleEditBlur = useCallback(
    (tbId: string, value: string) => {
      onUpdateContent(tbId, value);
      setEditingId(null);
    },
    [onUpdateContent],
  );

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>, tbId: string) => {
      if (e.key === "Escape") {
        setEditingId(null);
      }
    },
    [],
  );

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onSelectTextBox(null);
        setEditingId(null);
      }
    },
    [onSelectTextBox],
  );

  const showGrid = snapEnabled && textBoxes.length > 0;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: displayWidth,
        height: displayHeight,
        cursor: dragId ? "grabbing" : "default",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleBackgroundClick}
    >
      {/* Horizontal grid lines */}
      {showGrid &&
        Array.from({ length: gridSize + 1 }, (_, i) => {
          const pct = i * gridStep;
          return (
            <div
              key={`grid-h-${i}`}
              style={{
                position: "absolute",
                top: `${pct}%`,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                pointerEvents: "none",
              }}
            />
          );
        })}

      {/* Vertical grid lines */}
      {showGrid &&
        Array.from({ length: gridSize + 1 }, (_, i) => {
          const pct = i * gridStep;
          return (
            <div
              key={`grid-v-${i}`}
              style={{
                position: "absolute",
                left: `${pct}%`,
                top: 0,
                bottom: 0,
                width: 1,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                pointerEvents: "none",
              }}
            />
          );
        })}

      {/* Text box hit targets */}
      {textBoxes.map((tb) => {
        const xPct = dragId === tb.id && dragX != null ? dragX : tb.xPercent;
        const yPct = dragId === tb.id && dragY != null ? dragY : tb.yPercent;
        const isSelected = tb.id === selectedTextBoxId;
        const isEditing = tb.id === editingId;
        const lines = tb.content.split("\n");
        const longestLine = Math.max(...lines.map((l) => l.length), 1);
        const scaledFontSize = (tb.fontSize / 1080) * displayHeight;
        const hitHeight = Math.max(24, scaledFontSize * 1.2 * lines.length + 8);
        const hitWidth = Math.max(60, longestLine * scaledFontSize * 0.62 + 12);

        return (
          <div
            key={tb.id}
            style={{
              position: "absolute",
              left: `${xPct}%`,
              top: `${yPct}%`,
              width: isEditing ? Math.max(hitWidth, 120) : hitWidth,
              minHeight: hitHeight,
              transform: tb.justification === "left"
                ? "translateY(-100%)"
                : tb.justification === "right"
                  ? "translate(-100%, -100%)"
                  : "translate(-50%, -100%)",
              cursor: isEditing ? "text" : dragId === tb.id ? "grabbing" : "grab",
              border: isSelected
                ? "1px solid rgba(59, 130, 246, 0.7)"
                : "1px solid transparent",
              borderRadius: 2,
              backgroundColor: isSelected
                ? "rgba(59, 130, 246, 0.08)"
                : "transparent",
              transition: dragId ? "none" : "border-color 0.15s",
            }}
            onMouseDown={(e) => !isEditing && handleMouseDown(e, tb.id)}
            onDoubleClick={(e) => handleDoubleClick(e, tb.id)}
          >
            {isEditing && (
              <textarea
                autoFocus
                defaultValue={tb.content}
                onBlur={(e) => handleEditBlur(tb.id, e.target.value)}
                onKeyDown={(e) => handleEditKeyDown(e, tb.id)}
                style={{
                  width: "100%",
                  minHeight: hitHeight,
                  background: "rgba(0, 0, 0, 0.8)",
                  color: "#ffffff",
                  border: "none",
                  outline: "none",
                  resize: "both",
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: Math.max(10, (tb.fontSize / 1920) * displayWidth),
                  lineHeight: 1.1,
                  padding: "2px 4px",
                  textAlign: tb.justification,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
