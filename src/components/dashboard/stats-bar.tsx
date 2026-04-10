"use client";

import { Prospect } from "@/lib/types";
import { Users, TrendingUp, Trophy, AlertTriangle } from "lucide-react";

interface StatsBarProps {
  prospects: Prospect[];
}

export function StatsBar({ prospects }: StatsBarProps) {
  const total = prospects.length;
  const enPipeline = prospects.filter(
    (p) => p.estado !== "Ganado" && p.estado !== "Archivado"
  ).length;
  const ganados = prospects.filter((p) => p.estado === "Ganado").length;
  const altaPrioridad = prospects.filter(
    (p) => p.prioridad >= 4
  ).length;

  const stats = [
    {
      label: "Total Prospectos",
      value: total,
      icon: Users,
      gradient: "from-indigo-500 to-indigo-600",
      glow: "shadow-indigo-500/20",
    },
    {
      label: "En Pipeline",
      value: enPipeline,
      icon: TrendingUp,
      gradient: "from-cyan-500 to-cyan-600",
      glow: "shadow-cyan-500/20",
    },
    {
      label: "Ganados",
      value: ganados,
      icon: Trophy,
      gradient: "from-emerald-500 to-emerald-600",
      glow: "shadow-emerald-500/20",
    },
    {
      label: "Prioridad Alta",
      value: altaPrioridad,
      icon: AlertTriangle,
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 px-6 py-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`glass-card group relative overflow-hidden rounded-xl p-4 shadow-lg ${stat.glow} transition-all duration-300 hover:scale-[1.02]`}
          >
            {/* Background gradient decoration */}
            <div
              className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-xl transition-all duration-300 group-hover:opacity-20 group-hover:blur-2xl`}
            />

            <div className="relative flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.glow}`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
