-- Actualización de la tabla 'leads' para el Módulo de Comunicación Estratégica
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS telefono TEXT,
ADD COLUMN IF NOT EXISTS metodo_contacto TEXT DEFAULT 'WhatsApp',
ADD COLUMN IF NOT EXISTS draft_asunto TEXT,
ADD COLUMN IF NOT EXISTS draft_mensaje TEXT;
