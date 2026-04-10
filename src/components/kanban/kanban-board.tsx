"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useState } from "react";
import { Prospect, EstadoProspecto, ESTADOS } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";

interface KanbanBoardProps {
  prospectsByEstado: Record<EstadoProspecto, Prospect[]>;
  allProspects: Prospect[];
  onUpdateEstado: (prospectId: string, newEstado: EstadoProspecto) => void;
  onUpdateNotas: (prospectId: string, nuevasNotas: string) => void;
}

export function KanbanBoard({
  prospectsByEstado,
  allProspects,
  onUpdateEstado,
  onUpdateNotas,
}: KanbanBoardProps) {
  const [activeProspect, setActiveProspect] = useState<Prospect | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const prospectId = event.active.id as string;
    const prospect = allProspects.find((p) => p.id === prospectId);
    if (prospect) {
      setActiveProspect(prospect);
    }
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Visual feedback is handled by the KanbanColumn isOver state
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProspect(null);

    if (!over) return;

    const prospectId = active.id as string;
    const overId = over.id as string;

    // Check if dropped over a column (estado)
    if (ESTADOS.includes(overId as EstadoProspecto)) {
      const prospect = allProspects.find((p) => p.id === prospectId);
      if (prospect && prospect.estado !== overId) {
        onUpdateEstado(prospectId, overId as EstadoProspecto);
      }
      return;
    }

    // Check if dropped over another card — find which column the target card belongs to
    const targetProspect = allProspects.find((p) => p.id === overId);
    if (targetProspect) {
      const prospect = allProspects.find((p) => p.id === prospectId);
      if (prospect && prospect.estado !== targetProspect.estado) {
        onUpdateEstado(prospectId, targetProspect.estado);
      }
    }
  };

  // Filter out "Archivado" from main view (collapsed by default)
  const visibleEstados = ESTADOS.filter((e) => e !== "Archivado");
  const archivedCount = prospectsByEstado["Archivado"]?.length || 0;

  return (
    <div className="flex flex-1 flex-col">
      {/* Kanban columns */}
      <div className="kanban-scroll flex flex-1 gap-3 overflow-x-auto px-6 pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {visibleEstados.map((estado) => (
            <KanbanColumn
              key={estado}
              estado={estado}
              prospects={prospectsByEstado[estado] || []}
              onUpdateNotas={onUpdateNotas}
            />
          ))}

          {/* Archivado column (collapsed if empty) */}
          <KanbanColumn
            estado="Archivado"
            prospects={prospectsByEstado["Archivado"] || []}
            isCollapsed={archivedCount === 0}
            onUpdateNotas={onUpdateNotas}
          />

          {/* Drag overlay */}
          <DragOverlay>
            {activeProspect ? (
              <div className="drag-overlay w-[280px]">
                <KanbanCard prospect={activeProspect} onUpdateNotas={onUpdateNotas} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
