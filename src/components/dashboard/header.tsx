"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, Zap, Radar } from "lucide-react";

interface HeaderProps {
  onAddProspect: () => void;
  onOpenLeadFinder: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({
  onAddProspect,
  onOpenLeadFinder,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                LauchAR
              </span>{" "}
              <span className="text-foreground/80">CRM</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Gestión de Prospectos
            </p>
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar prospectos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 w-64 rounded-lg border border-border/60 bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Lead Finder button */}
          <Button
            onClick={onOpenLeadFinder}
            variant="outline"
            className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/60 hover:text-cyan-300 transition-all duration-300"
          >
            <Radar className="mr-2 h-4 w-4" />
            Buscar Leads
          </Button>

          {/* Add button */}
          <Button
            onClick={onAddProspect}
            className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-600 hover:to-violet-700 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Prospecto
          </Button>
        </div>
      </div>
    </header>
  );
}
