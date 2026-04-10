"use client";

import { PRIORIDAD_CONFIG } from "@/lib/types";
import { Star } from "lucide-react";

interface PriorityBadgeProps {
  priority: number;
  size?: "sm" | "md";
}

export function PriorityBadge({ priority, size = "sm" }: PriorityBadgeProps) {
  const config = PRIORIDAD_CONFIG[priority] || PRIORIDAD_CONFIG[3];

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${config.bgClass} ${
        size === "sm" ? "text-xs" : "text-sm"
      }`}
      title={`Prioridad: ${config.label}`}
    >
      <Star
        className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"}
        style={{ color: config.color }}
        fill={priority >= 4 ? config.color : "transparent"}
      />
      <span style={{ color: config.color }} className="font-medium">
        {priority}
      </span>
    </div>
  );
}
