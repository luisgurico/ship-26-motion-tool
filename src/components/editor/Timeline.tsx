"use client";

import React, { useState, useCallback } from "react";
import {
  type Screen,
  type ScreenType,
  SCREEN_TYPE_META,
  SCREEN_TYPES,
  createScreen,
} from "@/types";
import { Button } from "@/components/ui/button";
import {
  Plus,
  X,
  Type,
  Calendar,
  User,
  MousePointerClick,
  Image,
  FileText,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SCREEN_ICONS: Record<ScreenType, React.ReactNode> = {
  title: <Type className="h-3.5 w-3.5" />,
  "event-details": <Calendar className="h-3.5 w-3.5" />,
  speaker: <User className="h-3.5 w-3.5" />,
  cta: <MousePointerClick className="h-3.5 w-3.5" />,
  logo: <Image className="h-3.5 w-3.5" />,
  "custom-text": <FileText className="h-3.5 w-3.5" />,
};

interface TimelineProps {
  screens: Screen[];
  selectedScreenId: string | null;
  onSelect: (id: string) => void;
  onAdd: (screen: Screen) => void;
  onRemove: (id: string) => void;
  onReorder: (screens: Screen[]) => void;
}

function getScreenLabel(screen: Screen): string {
  switch (screen.type) {
    case "title":
      return screen.data.eventName || "Title";
    case "event-details":
      return screen.data.date || "Details";
    case "speaker":
      return screen.data.name || "Speaker";
    case "cta":
      return screen.data.ctaText || "CTA";
    case "logo":
      return "Logo";
    case "custom-text":
      return screen.data.heading || "Text";
  }
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
  const [showAddMenu, setShowAddMenu] = useState(false);

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
      <div className="flex items-center gap-2 overflow-x-auto">
        {screens.map((screen, i) => (
          <div
            key={screen.id}
            draggable
            onDragStart={(e) => handleDragStart(e, screen.id)}
            onDragOver={(e) => handleDragOver(e, screen.id)}
            onDrop={(e) => handleDrop(e, screen.id)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelect(screen.id)}
            className={cn(
              "group relative flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-all select-none shrink-0",
              "hover:border-zinc-500",
              selectedScreenId === screen.id
                ? "border-blue-500 bg-blue-500/10"
                : "border-border bg-accent",
              dragId === screen.id && "opacity-40",
              dragOverId === screen.id &&
                dragId !== screen.id &&
                "border-blue-400 border-dashed"
            )}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
            <span className="text-muted-foreground">
              {SCREEN_ICONS[screen.type]}
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {SCREEN_TYPE_META[screen.type].label}
              </span>
              <span className="text-xs font-mono text-foreground truncate max-w-[100px]">
                {getScreenLabel(screen)}
              </span>
            </div>
            {screens.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(screen.id);
                }}
                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-zinc-700 text-zinc-300 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        ))}

        <div className="relative shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-[52px] w-[52px] border-dashed"
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            <Plus className="h-4 w-4" />
          </Button>

          {showAddMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowAddMenu(false)}
              />
              <div className="absolute bottom-full left-0 mb-2 z-50 rounded-md border border-border bg-background p-1 shadow-lg min-w-[160px]">
                {SCREEN_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      onAdd(createScreen(type));
                      setShowAddMenu(false);
                    }}
                    className="flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-xs font-mono text-foreground hover:bg-accent transition-colors"
                  >
                    <span className="text-muted-foreground">
                      {SCREEN_ICONS[type]}
                    </span>
                    {SCREEN_TYPE_META[type].label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
