"use client";

import { ESTADO_CONFIG, EstadoProspecto } from "@/lib/types";

interface StatusBadgeProps {
  estado: EstadoProspecto;
}

export function StatusBadge({ estado }: StatusBadgeProps) {
  const config = ESTADO_CONFIG[estado];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bgClass} ${config.textClass}`}
    >
      <span>{config.emoji}</span>
      <span>{estado}</span>
    </span>
  );
}
