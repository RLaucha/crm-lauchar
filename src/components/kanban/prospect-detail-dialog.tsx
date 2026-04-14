"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ESTADOS, EstadoProspecto, Prospect, Tarea } from "@/lib/types";
import { useState, useEffect } from "react";
import { Building2, User, Globe, Phone, MessageCircle, Mail, CheckSquare, Plus, Trash2, ListTodo, Bot, Send } from "lucide-react";

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
      {/* Añadimos sm:max-w-[900px] w-[95vw] para sobreescribir el bloqueo default de shadcn */}
      <DialogContent className="glass-card border-border/50 sm:max-w-[900px] w-[95vw] max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/40 shrink-0 bg-background/50">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              {prospect.nombre}
              <div className="text-sm font-normal text-muted-foreground mt-0.5 flex flex-wrap gap-2 items-center">
                Editando prospecto y auditando con IA
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-5">
          
          {/* Panel Izquierdo: Edición de Datos Y Gemini (3 columnas) */}
          <ScrollArea className="h-full md:col-span-3 border-r border-border/40 p-6">
            <div className="space-y-6">
              
              {/* Bloque Formularios */}
              <div>
                <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-wider mb-4">Información Principal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Nombre / Empresa</label>
                    <Input
                      value={formData.nombre || ""}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      className="bg-muted/30 border-border/60 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Dueño / Socio</label>
                    <Input
                      value={formData.nombre_dueno || ""}
                      onChange={(e) => handleChange("nombre_dueno", e.target.value)}
                      className="bg-muted/30 border-border/60 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Globe className="h-3.5 w-3.5"/> Sitio Web</label>
                    <Input
                      value={formData.url || ""}
                      onChange={(e) => handleChange("url", e.target.value)}
                      className="bg-muted/30 border-border/60 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Etapa Comercial</label>
                    <Select
                      value={formData.estado}
                      onValueChange={(v) => handleChange("estado", v)}
                    >
                      <SelectTrigger className="bg-muted/30 border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {ESTADOS.map((e) => (
                          <SelectItem key={e} value={e}>{e}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Phone className="h-3.5 w-3.5"/> Teléfono</label>
                    <Input
                      value={formData.telefono || ""}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      className="bg-muted/30 border-border/60 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5"/> Email</label>
                    <Input
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="bg-muted/30 border-border/60 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-border/40" />

              {/* Bloque Inteligencia Artificial */}
              <div>
                <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-indigo-400" />
                  Estrategia Generada por Gemini
                </h3>

                {!formData.notas_ia ? (
                  <div className="text-center p-8 border border-dashed border-border/50 rounded-lg text-muted-foreground bg-muted/10">
                    Todavía no auditaste este cliente con la IA. Cerrá esta ventana y tocá "Generar Auditoría IA" en su tarjeta.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4">
                      <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Diagnóstico Interno</label>
                      <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                        {formData.notas_ia}
                      </p>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider block">Mensaje de Venta Listo</label>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400">
                          {formData.metodo_contacto}
                        </span>
                      </div>
                      
                      {formData.draft_asunto && (
                        <div>
                          <label className="text-[10px] text-muted-foreground font-semibold uppercase">Asunto / Gancho:</label>
                          <Input 
                            value={formData.draft_asunto} 
                            onChange={(e) => handleChange("draft_asunto", e.target.value)}
                            className="h-8 text-sm font-medium mt-1 border-emerald-500/30 bg-background/50 focus-visible:ring-emerald-500"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] text-muted-foreground font-semibold uppercase">Cuerpo del Mensaje:</label>
                        <Textarea 
                          value={formData.draft_mensaje || ""} 
                          onChange={(e) => handleChange("draft_mensaje", e.target.value)}
                          className="text-sm min-h-[160px] mt-1 border-emerald-500/30 bg-background/50 focus-visible:ring-emerald-500"
                        />
                      </div>
                      
                      {/* Enviar en directo  */}
                      <Button 
                        onClick={() => {
                          if (formData.metodo_contacto === 'WhatsApp') {
                            const num = formData.telefono || '';
                            window.open(`https://wa.me/${num.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(formData.draft_mensaje!)}`, '_blank');
                          } else {
                            const emailStr = formData.email || '';
                            window.open(`mailto:${emailStr}?subject=${encodeURIComponent(formData.draft_asunto || '')}&body=${encodeURIComponent(formData.draft_mensaje!)}`, '_blank');
                          }
                        }}
                        className="w-full bg-emerald-500 text-white hover:bg-emerald-600 gap-2 mt-2"
                      >
                        <Send className="h-4 w-4" />
                        Disparar Mensaje
                      </Button>

                    </div>
                  </div>
                )}
              </div>

            </div>
          </ScrollArea>

          {/* Panel Derecho: Lista de Tareas Contextuales (2 columnas) */}
          <div className="flex flex-col h-[50vh] md:h-full bg-muted/10 md:col-span-2 border-t md:border-t-0 md:border-l border-border/40">
            <div className="p-6 pb-4 shrink-0 bg-background/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-wider flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-indigo-400" />
                  Plan de Acción
                </h3>
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold shadow-sm ${isDevelopmentPhase ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                  {isDevelopmentPhase ? 'En Desarrollo' : 'Prospección'}
                </span>
              </div>
              <div className="flex gap-2">
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
                  className="bg-background/80 border-border/60 text-sm focus-visible:ring-indigo-500"
                />
                <Button onClick={handleAddTask} size="icon" className="shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-transform active:scale-95">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6 pt-2">
              <div className="space-y-2.5 pb-8">
                {(!formData.tareas || formData.tareas.length === 0) ? (
                  <div className="text-center p-8 border border-dashed border-border/50 rounded-xl text-muted-foreground text-sm bg-background/30">
                    Vacío por ahora. Ingresá el primer paso arriba.
                  </div>
                ) : (
                  formData.tareas.map((tarea) => (
                    <div
                      key={tarea.id}
                      className={`group flex items-start gap-3 p-3 rounded-lg border shadow-sm transition-all duration-200 ${
                        tarea.completed
                          ? "bg-muted/40 border-border/30 opacity-60"
                          : "bg-card/80 border-border/60 hover:bg-card hover:border-indigo-500/40 hover:shadow-md hover:-translate-y-0.5"
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(tarea.id)}
                        className={`mt-0.5 shrink-0 flex items-center justify-center h-5 w-5 rounded border transition-colors ${
                          tarea.completed
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
                            : "bg-background border-muted-foreground/40 hover:border-indigo-400"
                        }`}
                      >
                        {tarea.completed && <CheckSquare className="h-3.5 w-3.5" />}
                      </button>
                      <span className={`flex-1 text-sm leading-relaxed pt-0.5 ${tarea.completed ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>
                        {tarea.text}
                      </span>
                      <button
                        onClick={() => removeTask(tarea.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-all mt-0.5"
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
