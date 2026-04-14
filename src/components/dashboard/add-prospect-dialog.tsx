"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { ESTADOS, EstadoProspecto, Prospect } from "@/lib/types";
import { useState } from "react";
import { Building2, User, Globe, Star, StickyNote, Phone, MessageCircle, Mail } from "lucide-react";

interface AddProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (prospect: Omit<Prospect, "id" | "created_at" | "updated_at">) => void;
}

export function AddProspectDialog({
  open,
  onOpenChange,
  onAdd,
}: AddProspectDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    nombre_dueno: "",
    contacto: "",
    email: "",
    telefono: "",
    metodo_contacto: "WhatsApp" as "WhatsApp" | "Email",
    url: "",
    estado: "Prospecto" as EstadoProspecto,
    notas_ia: "",
    prioridad: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    onAdd({
      nombre: formData.nombre.trim(),
      nombre_dueno: formData.nombre_dueno.trim() || null,
      contacto: formData.contacto.trim() || null,
      email: formData.email.trim() || null,
      telefono: formData.telefono.trim() || null,
      metodo_contacto: formData.metodo_contacto,
      url: formData.url.trim() || null,
      estado: formData.estado,
      notas_ia: formData.notas_ia.trim() || null,
      draft_asunto: null,
      draft_mensaje: null,
      tareas: [],
      prioridad: formData.prioridad,
    });

    // Reset form
    setFormData({
      nombre: "",
      nombre_dueno: "",
      contacto: "",
      email: "",
      telefono: "",
      metodo_contacto: "WhatsApp",
      url: "",
      estado: "Prospecto",
      notas_ia: "",
      prioridad: 3,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 sm:max-w-[500px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            Nuevo Prospecto
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Agregá un nuevo negocio al pipeline de prospección.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nombre del negocio */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
              <Building2 className="h-3.5 w-3.5" />
              Nombre del Negocio *
            </label>
            <Input
              placeholder="Ej: Panadería Don Luis"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="bg-muted/50 border-border/60"
              required
            />
          </div>

          {/* Nombre Dueño y URL en Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                <User className="h-3.5 w-3.5" />
                Dueño / Socio
              </label>
              <Input
                placeholder="Ej: Marcos Pérez"
                value={formData.nombre_dueno}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_dueno: e.target.value })
                }
                className="bg-muted/50 border-border/60"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                <Globe className="h-3.5 w-3.5" />
                URL Actual
              </label>
              <Input
                placeholder="https://ejemplo.com.ar"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="bg-muted/50 border-border/60"
              />
            </div>
          </div>

          <div className="w-full border-t border-border/40 my-3" />

          {/* Contacto & Teléfono en Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                <User className="h-3.5 w-3.5" />
                Persona de Contacto
              </label>
              <Input
                placeholder="Si es otro distinto..."
                value={formData.contacto}
                onChange={(e) =>
                  setFormData({ ...formData, contacto: e.target.value })
                }
                className="bg-muted/50 border-border/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                <Phone className="h-3.5 w-3.5" />
                Celular / Teléfono
              </label>
              <Input
                placeholder="Ej: 549112345678"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                type="tel"
                className="bg-muted/50 border-border/60"
              />
            </div>
          </div>

          {/* Email y Método en Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                <Mail className="h-3.5 w-3.5" />
                Email
              </label>
              <Input
                placeholder="hola@ejemplo.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="email"
                className="bg-muted/50 border-border/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                <MessageCircle className="h-3.5 w-3.5" />
                Preferencia
              </label>
              <Select
                value={formData.metodo_contacto}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    metodo_contacto: v as "WhatsApp" | "Email",
                  })
                }
              >
                <SelectTrigger className="bg-muted/50 border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>



          {/* Estado + Prioridad in row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">
                Estado
              </label>
              <Select
                value={formData.estado}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    estado: v as EstadoProspecto,
                  })
                }
              >
                <SelectTrigger className="bg-muted/50 border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  {ESTADOS.filter((e) => e !== "Archivado").map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                <Star className="h-3.5 w-3.5" />
                Prioridad
              </label>
              <Select
                value={String(formData.prioridad)}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    prioridad: parseInt(v as string),
                  })
                }
              >
                <SelectTrigger className="bg-muted/50 border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} — {["Muy Baja", "Baja", "Media", "Alta", "Urgente"][n - 1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
              <StickyNote className="h-3.5 w-3.5" />
              Notas
            </label>
            <Textarea
              placeholder="Observaciones sobre el prospecto..."
              value={formData.notas_ia}
              onChange={(e) =>
                setFormData({ ...formData, notas_ia: e.target.value })
              }
              className="bg-muted/50 border-border/60 min-h-[80px] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700"
            >
              Agregar Prospecto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
