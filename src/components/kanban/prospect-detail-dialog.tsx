"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ESTADOS, EstadoProspecto, Prospect, Tarea } from "@/lib/types";
import { useState, useEffect } from "react";
import { Building2, User, Globe, Star, StickyNote, Phone, MessageCircle, Mail, CheckSquare, Plus, Trash2, ListTodo } from "lucide-react";

interface ProspectDetailDialogProps {
  prospect: Prospect | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (prospectId: string, updates: Partial<Prospect>) => void;
}

export function ProspectDetailDialog({
  prospect,
  open,
  onOpenChange,
  onUpdate,
}: ProspectDetailDialogProps) {
  const [formData, setFormData] = useState<Partial<Prospect>>({});
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    if (prospect) {
      setFormData(prospect);
    }
  }, [prospect]);

  if (!prospect) return null;

  const handleChange = (field: keyof Prospect, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(prospect.id, { [field]: value });
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: Tarea = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
    };
    const newTareas = [...(formData.tareas || []), newTask];
    handleChange("tareas", newTareas);
    setNewTaskText("");
  };

  const toggleTask = (taskId: string) => {
    const newTareas = (formData.tareas || []).map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    handleChange("tareas", newTareas);
  };

  const removeTask = (taskId: string) => {
    const newTareas = (formData.tareas || []).filter((t) => t.id !== taskId);
    handleChange("tareas", newTareas);
  };

  // Sugerencias lógicas basadas en el estado
  const isDevelopmentPhase = formData.estado === "Ganado" || formData.estado === "En Desarrollo";
  const defaultSuggestion = isDevelopmentPhase
    ? "Ej: Configurar dominio y DNS"
    : "Ej: Llamar por seguimiento o buscar en Linkedin";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/40 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              {prospect.nombre}
              <div className="text-xs font-normal text-muted-foreground mt-0.5">
                Editando prospecto y gestionando tareas automáticas
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Panel Izquierdo: Edición de Datos */}
          <ScrollArea className="h-full border-r border-border/40 p-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider mb-2">Información del Negocio</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Nombre</label>
                  <Input
                    value={formData.nombre || ""}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    className="h-8 text-sm bg-muted/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Dueño/Socio</label>
                  <Input
                    value={formData.nombre_dueno || ""}
                    onChange={(e) => handleChange("nombre_dueno", e.target.value)}
                    className="h-8 text-sm bg-muted/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">URL</label>
                  <Input
                    value={formData.url || ""}
                    onChange={(e) => handleChange("url", e.target.value)}
                    className="h-8 text-sm bg-muted/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Oportunidad</label>
                  <Select
                    value={formData.estado}
                    onValueChange={(v) => handleChange("estado", v)}
                  >
                    <SelectTrigger className="h-8 text-sm bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {ESTADOS.map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="w-full border-t border-border/40 my-4" />

              <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider mb-2">Contacto</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><User className="h-3 w-3"/> Referente</label>
                  <Input
                    value={formData.contacto || ""}
                    onChange={(e) => handleChange("contacto", e.target.value)}
                    className="h-8 text-sm bg-muted/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> Teléfono</label>
                  <Input
                    value={formData.telefono || ""}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    className="h-8 text-sm bg-muted/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3"/> Email</label>
                  <Input
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-8 text-sm bg-muted/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><MessageCircle className="h-3 w-3"/> Preferencia</label>
                  <Select
                    value={formData.metodo_contacto}
                    onValueChange={(v) => handleChange("metodo_contacto", v)}
                  >
                    <SelectTrigger className="h-8 text-sm bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>
          </ScrollArea>

          {/* Panel Derecho: Lista de Tareas Contextuales */}
          <div className="flex flex-col h-full bg-muted/10">
            <div className="p-6 pb-2 shrink-0 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-indigo-400" />
                Plan de Acción
              </h3>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${isDevelopmentPhase ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {isDevelopmentPhase ? 'Fase Técnica' : 'Fase Prospección'}
              </span>
            </div>

            <div className="px-6 py-2 shrink-0 flex gap-2">
              <Input
                placeholder={defaultSuggestion}
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTask();
                  }
                }}
                className="bg-background/50 border-border/60 text-sm"
              />
              <Button onClick={handleAddTask} size="icon" className="shrink-0 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-6 pt-2">
              <div className="space-y-2">
                {(!formData.tareas || formData.tareas.length === 0) ? (
                  <div className="text-center p-6 border border-dashed border-border/50 rounded-lg text-muted-foreground text-sm">
                    No hay tareas registradas aún.
                  </div>
                ) : (
                  formData.tareas.map((tarea) => (
                    <div
                      key={tarea.id}
                      className={`group flex items-center justify-between gap-3 p-2.5 rounded-md border transition-all ${
                        tarea.completed
                          ? "bg-muted/30 border-border/30 opacity-60"
                          : "bg-card/50 border-border/60 hover:bg-card hover:border-indigo-500/30"
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(tarea.id)}
                        className={`shrink-0 flex items-center justify-center h-5 w-5 rounded border ${
                          tarea.completed
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
                            : "border-muted-foreground/30 hover:border-indigo-400/50"
                        }`}
                      >
                        {tarea.completed && <CheckSquare className="h-3 w-3" />}
                      </button>
                      <span className={`flex-1 text-sm ${tarea.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {tarea.text}
                      </span>
                      <button
                        onClick={() => removeTask(tarea.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
