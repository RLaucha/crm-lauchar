import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { url, metodo_contacto } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API Key de Gemini no configurada' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const method = metodo_contacto || 'WhatsApp';

    const prompt = `
      Actúa como un Consultor Experto en Negocios Digitales de la agencia "LauchAR".
      Tu tarea es auditar superficialmente este dominio: ${url}
      Basado en el tipo de negocio o plataforma que parezca ser, debes generar un acercamiento de ventas persuasivo para enviar directamente por ${method}.
      Tu respuesta debe ser estrictamente un JSON válido (sin backticks de markdown) con esta estructura exacta:
      {
        "diagnostic": "Un mensaje corto (hablándole en tono colega a Lauti) indicando qué notaste en el sitio web (ej. usa Wix, carga lento, falta CTA, buen IG pero sin funnel) y qué servicio venderle.",
        "draft_asunto": "Si el método es Email, escribe un asunto atrapante y rompedor. Si el método es WhatsApp, pon null.",
        "draft_mensaje": "El texto del mensaje o email, estructurado: Gancho > Problema detectado > Solución veloz > Call to Action para agendar 10 minutos."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Check if we have response text
    if (!response.text) throw new Error("No response from Gemini");

    // Clean markdown if present
    const cleanedText = response.text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json({ 
      diagnostic: data.diagnostic, 
      draft_asunto: data.draft_asunto, 
      draft_mensaje: data.draft_mensaje 
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: 'Error analizando URL con Inteligencia Artificial' }, { status: 500 });
  }
}
