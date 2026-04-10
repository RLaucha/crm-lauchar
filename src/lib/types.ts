// ============================================
// CRM LauchAR — TypeScript Types
// ============================================

export const ESTADOS = [
  "Prospecto",
  "Auditado",
  "Contacto Iniciado",
  "En Conversación",
  "Presupuesto",
  "Ganado",
  "Archivado",
] as const;

export type EstadoProspecto = (typeof ESTADOS)[number];

export interface Prospect {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  contacto: string | null;
  telefono: string | null;
  metodo_contacto: 'WhatsApp' | 'Email';
  url: string | null;
  estado: EstadoProspecto;
  notas_ia: string | null;
  draft_asunto: string | null;
  draft_mensaje: string | null;
  prioridad: number; // 1-5
}

// Colores para cada estado del pipeline (HSL for Tailwind compatibility)
export const ESTADO_CONFIG: Record<
  EstadoProspecto,
  { color: string; bgClass: string; textClass: string; emoji: string }
> = {
  Prospecto: {
    color: "#6366f1",
    bgClass: "bg-indigo-500/20",
    textClass: "text-indigo-400",
    emoji: "🔍",
  },
  Auditado: {
    color: "#8b5cf6",
    bgClass: "bg-violet-500/20",
    textClass: "text-violet-400",
    emoji: "📋",
  },
  "Contacto Iniciado": {
    color: "#06b6d4",
    bgClass: "bg-cyan-500/20",
    textClass: "text-cyan-400",
    emoji: "📧",
  },
  "En Conversación": {
    color: "#f59e0b",
    bgClass: "bg-amber-500/20",
    textClass: "text-amber-400",
    emoji: "💬",
  },
  Presupuesto: {
    color: "#f97316",
    bgClass: "bg-orange-500/20",
    textClass: "text-orange-400",
    emoji: "💰",
  },
  Ganado: {
    color: "#22c55e",
    bgClass: "bg-emerald-500/20",
    textClass: "text-emerald-400",
    emoji: "🏆",
  },
  Archivado: {
    color: "#64748b",
    bgClass: "bg-slate-500/20",
    textClass: "text-slate-400",
    emoji: "📦",
  },
};

// Colores para prioridad (1-5)
export const PRIORIDAD_CONFIG: Record<
  number,
  { label: string; color: string; bgClass: string }
> = {
  1: { label: "Muy Baja", color: "#94a3b8", bgClass: "bg-slate-500/20" },
  2: { label: "Baja", color: "#3b82f6", bgClass: "bg-blue-500/20" },
  3: { label: "Media", color: "#eab308", bgClass: "bg-yellow-500/20" },
  4: { label: "Alta", color: "#f97316", bgClass: "bg-orange-500/20" },
  5: { label: "Urgente", color: "#ef4444", bgClass: "bg-red-500/20" },
};
