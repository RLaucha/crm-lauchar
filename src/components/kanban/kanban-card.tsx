"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Prospect, ESTADO_CONFIG } from "@/lib/types";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { GripVertical, Globe, User, Clock, Bot, Loader2 } from "lucide-react";
import { useState } from "react";

interface KanbanCardProps {
  prospect: Prospect;
  onUpdateNotas?: (prospectId: string, nuevasNotas: string) => void;
}

export function KanbanCard({ prospect, onUpdateNotas }: KanbanCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: prospect.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const estadoConfig = ESTADO_CONFIG[prospect.estado];

  // Format date relative
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} sem`;
    return `Hace ${Math.floor(days / 30)} mes${Math.floor(days / 30) > 1 ? "es" : ""}`;
  };

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!prospect.url || !onUpdateNotas) return;
    
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: prospect.url })
      });
      const data = await res.json();
      if (data.diagnostic) {
        onUpdateNotas(prospect.id, data.diagnostic);
      }
    } catch (error) {
      console.error("Error analyzing:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card-transition group rounded-lg border border-border/40 bg-card/80 p-3 backdrop-blur-sm ${
        isDragging ? "opacity-50 shadow-2xl ring-2 ring-primary/50" : ""
      }`}
    >
      {/* Header: drag handle + priority */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            className="cursor-grab touch-none rounded p-0.5 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-muted-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold text-foreground truncate">
            {prospect.nombre}
          </h3>
        </div>
        <PriorityBadge priority={prospect.prioridad} />
      </div>

      {/* Contact person */}
      {prospect.contacto && (
        <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3 shrink-0" />
          <span className="truncate">{prospect.contacto}</span>
        </div>
      )}

      {/* URL */}
      {prospect.url && (
        <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Globe className="h-3 w-3 shrink-0" />
          <a
            href={prospect.url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {prospect.url.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        </div>
      )}

      {/* Notes preview or Action Button */}
      {prospect.notas_ia ? (
        <div className="mb-2 group/notes relative">
          <p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
            {prospect.notas_ia}
          </p>
          {prospect.url && onUpdateNotas && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="absolute -top-1 right-0 opacity-0 group-hover/notes:opacity-100 transition-opacity bg-background/90 p-1 rounded-md border border-border/50 text-indigo-400 hover:text-indigo-300 shadow-sm"
              title="Re-generar Auditoría IA"
            >
              {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bot className="h-3 w-3" />}
            </button>
          )}
        </div>
      ) : prospect.url && onUpdateNotas ? (
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-indigo-500/10 py-1.5 text-xs font-medium text-indigo-400 opacity-80 transition-all hover:bg-indigo-500/20 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Bot className="h-3.5 w-3.5" />
          )}
          {isAnalyzing ? "Analizando sitio..." : "Generar Auditoría IA"}
        </button>
      ) : null}

      {/* Footer: date */}
      <div className="flex items-center justify-between pt-1 border-t border-border/30">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
          <Clock className="h-2.5 w-2.5" />
          {formatDate(prospect.updated_at)}
        </div>
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: estadoConfig.color }}
        />
      </div>
    </div>
  );
}
