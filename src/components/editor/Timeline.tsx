"use client";

import React, { useState, useCallback } from "react";
import { type Screen, createScreen } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineProps {
  screens: Screen[];
  selectedScreenId: string | null;
  onSelect: (id: string) => void;
  onAdd: (screen: Screen) => void;
  onRemove: (id: string) => void;
  onReorder: (screens: Screen[]) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  screens,
  selectedScreenId,
  onSelect,
  onAdd,
  onRemove,
  onReorder,
}) => {
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, id: string) => {
      setDragId(id);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, id: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverId(id);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      setDragOverId(null);
      setDragId(null);

      if (!dragId || dragId === targetId) return;

      const fromIndex = screens.findIndex((s) => s.id === dragId);
      const toIndex = screens.findIndex((s) => s.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return;

      const next = [...screens];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      onReorder(next);
    },
    [dragId, screens, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setDragOverId(null);
  }, []);

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      <div className="flex items-center justify-center gap-2 overflow-x-auto">
        {screens.map((screen) => (
          <div
            key={screen.id}
            draggable
            onDragStart={(e) => handleDragStart(e, screen.id)}
            onDragOver={(e) => handleDragOver(e, screen.id)}
            onDrop={(e) => handleDrop(e, screen.id)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelect(screen.id)}
            className={cn(
              "group relative flex items-center gap-1.5 rounded-md border px-3 py-2 cursor-pointer transition-all select-none shrink-0",
              "hover:border-white/20",
              selectedScreenId === screen.id
                ? "border-white/40 bg-white/5"
                : "border-border bg-accent",
              dragId === screen.id && "opacity-40",
              dragOverId === screen.id &&
                dragId !== screen.id &&
                "border-white/30 border-dashed"
            )}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
            <span className="text-xs font-mono text-foreground truncate max-w-[120px]">
              {screen.name}
            </span>
            {screens.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(screen.id);
                }}
                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-white/10 text-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-[40px] w-[40px] border-dashed shrink-0"
          onClick={() => onAdd(createScreen())}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
