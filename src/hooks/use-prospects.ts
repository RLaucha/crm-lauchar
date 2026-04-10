"use client";

import { useState, useCallback, useEffect } from "react";
import { Prospect, EstadoProspecto, ESTADOS } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export function useProspects() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load from Supabase on mount
  useEffect(() => {
    const fetchProspects = async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setProspects(data as Prospect[]);
      }
    };
    fetchProspects();
  }, []);

  // Add a new prospect
  const addProspect = useCallback(
    async (data: Omit<Prospect, "id" | "created_at" | "updated_at">) => {
      const newProps = {
        ...data,
      };

      // Optimistic update
      const tempId = crypto.randomUUID();
      const tempProspect: Prospect = {
        ...newProps,
        id: tempId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProspects((prev) => [tempProspect, ...prev]);

      const { data: insertedData, error } = await supabase
        .from('leads')
        .insert([newProps])
        .select()
        .single();

      if (!error && insertedData) {
        setProspects((prev) =>
          prev.map((p) => (p.id === tempId ? insertedData : p))
        );
      }
    },
    []
  );

  // Update prospect state (for drag & drop)
  const updateProspectEstado = useCallback(
    async (prospectId: string, newEstado: EstadoProspecto) => {
      // Optimistic update
      setProspects((prev) =>
        prev.map((p) =>
          p.id === prospectId
            ? { ...p, estado: newEstado, updated_at: new Date().toISOString() }
            : p
        )
      );

      // Backend update
      await supabase
        .from('leads')
        .update({ estado: newEstado, updated_at: new Date().toISOString() })
        .eq('id', prospectId);
    },
    []
  );

  // Update prospect AI notes
  const updateProspectNotas = useCallback(
    async (prospectId: string, nuevasNotas: string, draftAsunto: string | null, draftMensaje: string | null) => {
      // Optimistic update
      setProspects((prev) =>
        prev.map((p) =>
          p.id === prospectId
            ? { ...p, notas_ia: nuevasNotas, draft_asunto: draftAsunto, draft_mensaje: draftMensaje, updated_at: new Date().toISOString() }
            : p
        )
      );

      // Backend update
      await supabase
        .from('leads')
        .update({ 
          notas_ia: nuevasNotas, 
          draft_asunto: draftAsunto,
          draft_mensaje: draftMensaje,
          updated_at: new Date().toISOString() 
        })
        .eq('id', prospectId);
    },
    []
  );

  // Filter prospects by search query
  const filteredProspects = prospects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(q) ||
      p.contacto?.toLowerCase().includes(q) ||
      p.notas_ia?.toLowerCase().includes(q)
    );
  });

  // Group prospects by estado (for Kanban columns)
  const prospectsByEstado = ESTADOS.reduce(
    (acc, estado) => {
      acc[estado] = filteredProspects.filter((p) => p.estado === estado);
      return acc;
    },
    {} as Record<EstadoProspecto, Prospect[]>
  );

  return {
    prospects: filteredProspects,
    prospectsByEstado,
    addProspect,
    updateProspectEstado,
    updateProspectNotas,
    searchQuery,
    setSearchQuery,
  };
}
