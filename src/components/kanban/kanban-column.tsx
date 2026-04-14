"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Prospect, EstadoProspecto, ESTADO_CONFIG } from "@/lib/types";
import { KanbanCard } from "./kanban-card";

interface KanbanColumnProps {
  estado: EstadoProspecto;
  prospects: Prospect[];
  isCollapsed?: boolean;
  onUpdateNotas: (prospectId: string, nuevasNotas: string, draftAsunto: string | null, draftMensaje: string | null) => void;
  onCardClick: (prospect: Prospect) => void;
}

export function KanbanColumn({
  estado,
  prospects,
  isCollapsed = false,
  onUpdateNotas,
  onCardClick,
}: KanbanColumnProps) {
  const config = ESTADO_CONFIG[estado];
  const { setNodeRef, isOver } = useDroppable({ id: estado });

  if (isCollapsed && prospects.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex h-full w-[300px] min-w-[300px] flex-col rounded-xl border border-border/30 bg-muted/30 transition-all duration-300 ${
        isOver ? "column-drop-active bg-primary/5" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 border-b border-border/30 px-3 py-3">
        <div
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: config.color }}
        />
        <span className="text-sm font-semibold text-foreground truncate">
          {config.emoji} {estado}
        </span>
        <span
          className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[11px] font-medium ${config.bgClass} ${config.textClass}`}
        >
          {prospects.length}
        </span>
      </div>

      {/* Cards container */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        <SortableContext
          items={prospects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {prospects.map((prospect) => (
            <KanbanCard key={prospect.id} prospect={prospect} onUpdateNotas={onUpdateNotas} onCardClick={onCardClick} />
          ))}
        </SortableContext>

        {/* Empty state */}
        {prospects.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/30 py-8">
            <p className="text-xs text-muted-foreground/50">
              Arrastrá prospectos aquí
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
