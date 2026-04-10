-- Elimina la tabla si ya existe para crearla desde cero (opcional)
-- DROP TABLE IF EXISTS public.leads;

CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    contacto TEXT,
    url TEXT,
    estado TEXT DEFAULT 'Prospecto' NOT NULL,
    prioridad INTEGER DEFAULT 1,
    notas_ia TEXT
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Como estamos conectando de una manera sencilla para el MVP (sin autenticación de usuarios),
-- permitimos el acceso público para lectura y escritura a través de la anon_key.
CREATE POLICY "Permitir todo a anon" 
ON public.leads 
FOR ALL 
USING (true);
