-- Actualización de la tabla 'leads' para LauchAR CRM Pro
-- Integrando Cerebro Gemini, Edición dinámica y Tareas

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS nombre_dueno TEXT,
ADD COLUMN IF NOT EXISTS tareas JSONB DEFAULT '[]'::jsonb;

-- Limpieza de leads simulados viejos reportados
DELETE FROM public.leads WHERE nombre ILIKE '%Uptown%' OR nombre ILIKE '%Solileb%';
