"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { SearchLead, Prospect } from "@/lib/types";
import {
  Radar,
  Search,
  Loader2,
  Globe,
  Phone,
  Star,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  CheckSquare,
  Square,
  Bot,
  ArrowRight,
  XCircle,
} from "lucide-react";

interface LeadFinderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportLeads: (
    leads: Omit<Prospect, "id" | "created_at" | "updated_at">[]
  ) => void;
}

type SearchState = "idle" | "searching" | "analyzing" | "done" | "error";

export function LeadFinderDialog({
  open,
  onOpenChange,
  onImportLeads,
}: LeadFinderDialogProps) {
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState<SearchLead[]>([]);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [importedCount, setImportedCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedCount = leads.filter((l) => l.selected).length;

  const handleSearch = useCallback(async () => {
    if (!query.trim() || query.trim().length < 3) return;

    setSearchState("searching");
    setLeads([]);
    setErrorMessage("");
    setShowSuccess(false);
    setImportedCount(0);

    try {
      // Phase 1: Searching
      setTimeout(() => setSearchState("analyzing"), 2000);

      const res = await fetch("/api/search-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error en la búsqueda");
      }

      if (data.leads && data.leads.length > 0) {
        setLeads(data.leads);
        setSearchState("done");
      } else {
        setLeads([]);
        setSearchState("done");
        setErrorMessage(
          data.message || "No se encontraron resultados. Probá con otra búsqueda."
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Error buscando leads. Intentá de nuevo."
      );
    }
  }, [query]);

  const toggleSelect = (index: number) => {
    setLeads((prev) =>
      prev.map((lead, i) =>
        i === index ? { ...lead, selected: !lead.selected } : lead
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = leads.every((l) => l.selected);
    setLeads((prev) => prev.map((lead) => ({ ...lead, selected: !allSelected })));
  };

  const handleImport = () => {
    const selectedLeads = leads.filter((l) => l.selected);
    if (selectedLeads.length === 0) return;

    const prospectsToImport = selectedLeads.map((lead) => ({
      nombre: lead.title,
      nombre_dueno: null,
      contacto: null,
      email: null,
      telefono: lead.phone,
      metodo_contacto: "WhatsApp" as const,
      url: lead.website,
      estado: "Prospecto" as const,
      notas_ia: `📍 ${lead.address}\n⭐ Rating: ${lead.rating || "N/A"} (${lead.ratingCount || 0} reseñas)\n🏷️ ${lead.category || "Sin categoría"}\n${lead.plataforma_detectada ? `⚠️ Plataforma: ${lead.plataforma_detectada}` : ""}\n\n🤖 IA: ${lead.razon_ia}`,
      draft_asunto: null,
      draft_mensaje: null,
      tareas: [],
      prioridad: lead.prioridad,
    }));

    onImportLeads(prospectsToImport);
    setImportedCount(selectedLeads.length);
    setShowSuccess(true);

    // Remove imported leads from the list
    setLeads((prev) => prev.filter((l) => !l.selected));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const getPlatformBadge = (lead: SearchLead) => {
    if (!lead.website) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
          <XCircle className="h-2.5 w-2.5" />
          Sin Web
        </span>
      );
    }
    if (lead.plataforma_detectada) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
          <AlertTriangle className="h-2.5 w-2.5" />
          {lead.plataforma_detectada}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
        <Globe className="h-2.5 w-2.5" />
        Web propia
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Radar className="h-4 w-4 text-white" />
            </div>
            Buscador de Leads
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Buscá negocios por rubro y ubicación. La IA encuentra y califica
            los mejores prospectos para LauchAR.
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="lead-finder-search"
              placeholder='Ej: "Restaurantes en Belgrano", "Peluquerías en Palermo"...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={searchState === "searching" || searchState === "analyzing"}
              className="bg-muted/50 border-border/60 pl-9"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={
              !query.trim() ||
              query.trim().length < 3 ||
              searchState === "searching" ||
              searchState === "analyzing"
            }
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 min-w-[120px]"
          >
            {searchState === "searching" || searchState === "analyzing" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Radar className="mr-2 h-4 w-4" />
            )}
            Buscar
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[55vh]">
          {/* Idle State */}
          {searchState === "idle" && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="relative mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20">
                  <Radar className="h-10 w-10 text-cyan-400" />
                </div>
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Búsqueda Inteligente con IA
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Escribí un rubro y ubicación. La IA buscará negocios reales,
                analizará su presencia digital y los calificará automáticamente.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {[
                  "Restaurantes en Belgrano",
                  "Peluquerías en Palermo",
                  "Gimnasios en Caballito",
                  "Veterinarias en Núñez",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                    }}
                    className="rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs text-muted-foreground hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Searching/Analyzing State */}
          {(searchState === "searching" || searchState === "analyzing") && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="relative mb-6">
                <div className="lead-finder-radar flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/30">
                  <Radar className="h-10 w-10 text-cyan-400 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {searchState === "searching"
                  ? "🔍 Buscando negocios..."
                  : "🤖 Analizando con IA..."}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchState === "searching"
                  ? `Rastreando "${query}" en Google...`
                  : "Gemini está evaluando cada negocio para LauchAR..."}
              </p>

              {/* Progress steps */}
              <div className="mt-6 flex flex-col gap-2 text-left w-64">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Búsqueda iniciada</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {searchState === "analyzing" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                  )}
                  <span
                    className={
                      searchState === "analyzing"
                        ? "text-emerald-400"
                        : "text-cyan-400"
                    }
                  >
                    Rastreando Google Maps
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {searchState === "analyzing" ? (
                    <Loader2 className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-border/50" />
                  )}
                  <span
                    className={
                      searchState === "analyzing"
                        ? "text-cyan-400"
                        : "text-muted-foreground/50"
                    }
                  >
                    Análisis IA de prospectos
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3.5 w-3.5 rounded-full border border-border/50" />
                  <span className="text-muted-foreground/50">
                    Calificación y priorización
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {searchState === "error" && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Error en la búsqueda
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {errorMessage}
              </p>
              <Button
                onClick={handleSearch}
                variant="ghost"
                className="mt-4 text-cyan-400 hover:text-cyan-300"
              >
                Reintentar
              </Button>
            </div>
          )}

          {/* Results */}
          {searchState === "done" && leads.length > 0 && (
            <div className="space-y-2">
              {/* Toolbar */}
              <div className="flex items-center justify-between sticky top-0 bg-popover/95 backdrop-blur-sm py-2 z-10 border-b border-border/30 mb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {leads.every((l) => l.selected) ? (
                      <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
                    ) : (
                      <Square className="h-3.5 w-3.5" />
                    )}
                    {leads.every((l) => l.selected)
                      ? "Deseleccionar todos"
                      : "Seleccionar todos"}
                  </button>
                  <span className="text-xs text-muted-foreground/60">
                    {leads.length} resultados • {selectedCount} seleccionados
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-[10px] text-violet-400 font-medium">
                    Calificados por Gemini
                  </span>
                </div>
              </div>

              {/* Lead Cards */}
              {leads.map((lead, index) => (
                <div
                  key={`${lead.title}-${index}`}
                  onClick={() => toggleSelect(index)}
                  className={`group relative cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                    lead.selected
                      ? "border-cyan-500/50 bg-cyan-500/5 shadow-sm shadow-cyan-500/10"
                      : "border-border/40 bg-card/50 hover:border-border/70 hover:bg-card/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      {lead.selected ? (
                        <CheckSquare className="h-4 w-4 text-cyan-400" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground/70" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {lead.title}
                          </h4>
                          {getPlatformBadge(lead)}
                        </div>
                        <PriorityBadge priority={lead.prioridad} />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-1.5">
                        {lead.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {lead.address}
                            </span>
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 shrink-0" />
                            {lead.phone}
                          </span>
                        )}
                        {lead.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 shrink-0 text-amber-400" />
                            {lead.rating}
                            {lead.ratingCount && (
                              <span className="text-muted-foreground/50">
                                ({lead.ratingCount})
                              </span>
                            )}
                          </span>
                        )}
                        {lead.website && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3 shrink-0" />
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate max-w-[150px] hover:text-primary transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {lead.website.replace(/^https?:\/\/(www\.)?/, "")}
                            </a>
                          </span>
                        )}
                      </div>

                      {/* AI Reason */}
                      <div className="flex items-start gap-1.5 mt-1.5">
                        <Sparkles className="h-3 w-3 shrink-0 text-violet-400 mt-0.5" />
                        <p className="text-xs text-violet-300/80 leading-relaxed">
                          {lead.razon_ia}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty results */}
          {searchState === "done" && leads.length === 0 && errorMessage && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-base font-semibold text-foreground mb-1">
                Sin resultados
              </h3>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Import Success Toast */}
        {showSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 animate-in fade-in-0 slide-in-from-bottom-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-sm text-emerald-300">
              ✅ {importedCount} lead{importedCount !== 1 ? "s" : ""} importado
              {importedCount !== 1 ? "s" : ""} al CRM
            </span>
          </div>
        )}

        {/* Footer Actions */}
        {searchState === "done" && leads.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              {selectedCount} de {leads.length} seleccionados
            </p>
            <Button
              onClick={handleImport}
              disabled={selectedCount === 0}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
            >
              <Download className="mr-2 h-4 w-4" />
              Importar {selectedCount > 0 ? `(${selectedCount})` : ""}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
