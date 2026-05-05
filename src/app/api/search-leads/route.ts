import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Plataformas gratuitas/básicas que indican oportunidad para LauchAR
const FREE_PLATFORMS = [
  'wix', 'wixsite', 'weebly', 'wordpress.com', 'blogspot',
  'linktree', 'linktr.ee', 'carrd.co', 'godaddysites',
  'squarespace', 'jimdo', 'webnode', 'empretienda',
  'mitiendanube', 'tiendanube',
];

function detectPlatform(url: string | null): string | null {
  if (!url) return null;
  const lower = url.toLowerCase();
  for (const platform of FREE_PLATFORMS) {
    if (lower.includes(platform)) {
      return platform.replace('.com', '').replace('.co', '').replace('.ee', '');
    }
  }
  return null;
}

function calculatePriority(website: string | null): number {
  if (!website || website.trim() === '') return 5; // Sin web → Urgente
  const platform = detectPlatform(website);
  if (platform) return 4; // Plataforma gratuita → Alta
  return 3; // Tiene web propia → Media (Gemini puede ajustar)
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length < 3) {
      return NextResponse.json(
        { error: 'La búsqueda debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API Key de Gemini no configurada' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Paso 1: Usar Gemini con Google Search grounding para encontrar negocios reales
    const searchPrompt = `
Busca negocios reales de "${query}" en Argentina.
Para cada negocio que encuentres, necesito:
- Nombre del negocio
- Dirección completa
- Teléfono (si disponible)
- Sitio web / URL (si tiene)
- Rating de Google (si disponible)
- Cantidad de reseñas (si disponible)
- Categoría/rubro

IMPORTANTE: Busca al menos 10 negocios reales y actuales. Focalizate en negocios locales/PyMEs.
Devolvé ÚNICAMENTE un JSON válido (sin backticks de markdown) con esta estructura:
{
  "negocios": [
    {
      "title": "Nombre del Negocio",
      "address": "Dirección completa",
      "phone": "teléfono o null",
      "website": "url del sitio web o null",
      "rating": 4.5,
      "ratingCount": 120,
      "category": "Restaurante"
    }
  ]
}
`;

    const searchResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    if (!searchResponse.text) {
      throw new Error('No se obtuvieron resultados de búsqueda');
    }

    // Limpiar y parsear la respuesta de búsqueda
    const cleanedSearch = searchResponse.text
      .replace(/```json\n?/g, '')
      .replace(/```/g, '')
      .trim();

    let searchData: { negocios: Array<{
      title: string;
      address: string;
      phone: string | null;
      website: string | null;
      rating: number | null;
      ratingCount: number | null;
      category: string | null;
    }> };

    try {
      searchData = JSON.parse(cleanedSearch);
    } catch {
      // Si Gemini no devolvió JSON perfecto, intentar extraer el JSON del texto
      const jsonMatch = cleanedSearch.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        searchData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se pudo parsear la respuesta de búsqueda');
      }
    }

    if (!searchData.negocios || searchData.negocios.length === 0) {
      return NextResponse.json({ leads: [], message: 'No se encontraron negocios para esa búsqueda' });
    }

    // Paso 2: Aplicar filtro inteligente de prioridad
    const leadsWithPriority = searchData.negocios.map((negocio) => ({
      ...negocio,
      prioridad: calculatePriority(negocio.website),
      plataforma_detectada: detectPlatform(negocio.website),
    }));

    // Paso 3: Usar Gemini para calificar y recomendar los mejores prospectos
    const qualifyPrompt = `
Sos el Cerebro IA de "LauchAR", una agencia de desarrollo web y marketing digital en Argentina.
Tu servicio principal es crear sitios web profesionales, landing pages, y soluciones digitales para PyMEs.

Analizá estos negocios encontrados buscando "${query}" y para cada uno escribí una razón breve (1-2 oraciones máximo) de por qué es un buen prospecto para LauchAR.

Reglas de prioridad (ya pre-calculadas, podés ajustar si tiene sentido):
- Prioridad 5: No tiene sitio web → URGENTE, necesita uno
- Prioridad 4: Usa plataforma gratuita (Wix, Linktree, etc.) → ALTA, puede mejorar
- Prioridad 3: Tiene web propia → MEDIA, evaluar si necesita rediseño
- Prioridad 2: Web decente → BAJA prioridad
- Prioridad 1: Ya tiene web profesional → MUY BAJA

Negocios a analizar:
${JSON.stringify(leadsWithPriority, null, 2)}

Devolvé ÚNICAMENTE un JSON válido (sin backticks) con esta estructura:
{
  "leads": [
    {
      "title": "Nombre",
      "address": "Dirección",
      "phone": "tel o null",
      "website": "url o null",
      "rating": 4.5,
      "ratingCount": 120,
      "category": "Categoría",
      "prioridad": 5,
      "plataforma_detectada": "wix o null",
      "razon_ia": "Razón breve de por qué contactarlo"
    }
  ]
}

Ordenalos de mayor a menor prioridad (los más urgentes primero).
`;

    const qualifyResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: qualifyPrompt,
    });

    if (!qualifyResponse.text) {
      // Si falla la calificación, devolver con razones genéricas
      const fallbackLeads = leadsWithPriority.map((lead) => ({
        ...lead,
        razon_ia: lead.prioridad >= 4
          ? 'Sin presencia web profesional. Oportunidad directa para LauchAR.'
          : 'Evaluar calidad de su sitio web actual.',
        selected: false,
      }));
      return NextResponse.json({ leads: fallbackLeads });
    }

    const cleanedQualify = qualifyResponse.text
      .replace(/```json\n?/g, '')
      .replace(/```/g, '')
      .trim();

    let qualifiedData: { leads: Array<{
      title: string;
      address: string;
      phone: string | null;
      website: string | null;
      rating: number | null;
      ratingCount: number | null;
      category: string | null;
      prioridad: number;
      plataforma_detectada: string | null;
      razon_ia: string;
    }> };

    try {
      qualifiedData = JSON.parse(cleanedQualify);
    } catch {
      const jsonMatch = cleanedQualify.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        qualifiedData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: usar datos pre-calificados
        const fallbackLeads = leadsWithPriority.map((lead) => ({
          ...lead,
          razon_ia: lead.prioridad >= 4
            ? 'Sin presencia web profesional. Oportunidad directa.'
            : 'Evaluar su presencia digital actual.',
          selected: false,
        }));
        return NextResponse.json({ leads: fallbackLeads });
      }
    }

    // Agregar selected: false para el UI
    const finalLeads = qualifiedData.leads.map((lead) => ({
      ...lead,
      selected: false,
    }));

    return NextResponse.json({ leads: finalLeads });

  } catch (error) {
    console.error('Search Leads Error:', error);
    return NextResponse.json(
      { error: 'Error buscando leads. Intentá de nuevo.' },
      { status: 500 }
    );
  }
}
