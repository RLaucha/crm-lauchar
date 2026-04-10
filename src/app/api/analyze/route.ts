import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    // Simulamos un delay de "procesamiento IA" de 1.5s
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let diagnostic = '';
    const urlLower = url.toLowerCase();

    // Lógica simulada de diagnóstico
    if (urlLower.includes('wixsite') || urlLower.includes('wix.com')) {
      diagnostic = "🤖 IA: Lauti, este cliente está usando Wix y carga súper lento. Además el diseño no es responsive. Ofrecéle nuestro 'Plan Migración Express' a Next.js para mejorar rendimiento y SEO, ¡es venta casi asegurada porque ya entienden la necesidad de la web!";
    } else if (urlLower.includes('instagram.com')) {
      diagnostic = "🤖 IA: Lauti, a este cliente le falta canalizar ventas. Tienen buen feed de Instagram pero cierran todo por mensaje privado, se les debe escapar gente de madrugada. Ofrecéle una Landing Page + Integración de turnos/reservas automáticas.";
    } else if (urlLower.includes('facebook.com')) {
      diagnostic = "🤖 IA: Lauti, este negocio se quedó en 2015 vendiendo solo por Facebook. Necesitan presencia profesional urgente. Ofrecéle el 'Pack Negocio Digital Inicial' con catálogo integrado y botón de WhatsApp.";
    } else if (urlLower.includes('tiendanube')) {
      diagnostic = "🤖 IA: Lauti, ya usan TiendaNube así que tienen experiencia en e-commerce. Revisá si les está resultando cara la comisión mensual. Ofrecéle un desarrollo a medida si escalaron mucho en ventas mensuales.";
    } else {
      diagnostic = "🤖 IA: Lauti, el sitio base parece viejo y sin llamados a la acción claros. Le falta un buen embudo de conversión (CRO). Ofrecéle un rediseño UI/UX enfocado en generar leads directos a su WhatsApp.";
    }

    return NextResponse.json({ diagnostic });

  } catch (error) {
    return NextResponse.json({ error: 'Error analizando URL' }, { status: 500 });
  }
}
