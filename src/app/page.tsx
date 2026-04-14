"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { AddProspectDialog } from "@/components/dashboard/add-prospect-dialog";
import { ProspectDetailDialog } from "@/components/kanban/prospect-detail-dialog";
import { useProspects } from "@/hooks/use-prospects";
import { Prospect } from "@/lib/types";

export default function DashboardPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  const {
    prospects,
    prospectsByEstado,
    addProspect,
    updateProspect,
    updateProspectEstado,
    updateProspectNotas,
    searchQuery,
    setSearchQuery,
  } = useProspects();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header
        onAddProspect={() => setIsAddDialogOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="flex flex-1 flex-col overflow-hidden">
        <StatsBar prospects={prospects} />
        <KanbanBoard
          prospectsByEstado={prospectsByEstado}
          allProspects={prospects}
          onUpdateEstado={updateProspectEstado}
          onUpdateNotas={updateProspectNotas}
          onCardClick={setSelectedProspect}
        />
      </main>

      <AddProspectDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={addProspect}
      />

      <ProspectDetailDialog
        prospect={selectedProspect}
        open={!!selectedProspect}
        onOpenChange={(open) => !open && setSelectedProspect(null)}
        onUpdate={updateProspect}
      />
    </div>
  );
}
