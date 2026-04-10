-- ============================================
-- CRM LauchAR — Esquema de Base de Datos
-- Supabase (PostgreSQL)
-- ============================================

-- Enum para estados del pipeline de ventas
CREATE TYPE estado_prospecto AS ENUM (
  'Prospecto',
  'Auditado',
  'Contacto Iniciado',
  'En Conversación',
  'Presupuesto',
  'Ganado',
  'Archivado'
);

-- Tabla principal de prospectos
CREATE TABLE public.prospects (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at        TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT now() NOT NULL,
  nombre_negocio    TEXT NOT NULL,
  contacto_persona  TEXT,
  url_actual        TEXT,
  estado            estado_prospecto DEFAULT 'Prospecto' NOT NULL,
  notas             TEXT,
  puntaje_prioridad INTEGER DEFAULT 3 CHECK (puntaje_prioridad >= 1 AND puntaje_prioridad <= 5)
);

-- Índices para queries frecuentes del dashboard
CREATE INDEX idx_prospects_estado ON public.prospects(estado);
CREATE INDEX idx_prospects_puntaje ON public.prospects(puntaje_prioridad DESC);
CREATE INDEX idx_prospects_created ON public.prospects(created_at DESC);

-- Trigger para auto-actualizar updated_at en cada UPDATE
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS (Row Level Security)
-- Activar cuando se integre Supabase Auth
-- ============================================
-- ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Users can view their own prospects"
--   ON public.prospects FOR SELECT
--   USING (auth.uid() = user_id);
--
-- CREATE POLICY "Users can insert their own prospects"
--   ON public.prospects FOR INSERT
--   WITH CHECK (auth.uid() = user_id);
--
-- CREATE POLICY "Users can update their own prospects"
--   ON public.prospects FOR UPDATE
--   USING (auth.uid() = user_id);
