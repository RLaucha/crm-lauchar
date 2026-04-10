import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url, metodo_contacto } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    // Simulamos un delay de "procesamiento IA" de 1.5s
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let diagnostic = '';
    let draft_asunto = null;
    let draft_mensaje = '';
    
    const urlLower = url.toLowerCase();

    // Análisis base
    if (urlLower.includes('wixsite') || urlLower.includes('wix.com')) {
      diagnostic = "🤖 IA: Usa Wix. Carga lenta y mal SEO. Ideal para plan 'Migración Express'.";
      if (metodo_contacto === 'WhatsApp') {
        draft_mensaje = "¡Hola! Vi tu página en Wix. Noté que tarda en cargar bastante, lo que puede estar espantando clientes rápidos. En LauchAR mudamos sitios a tecnologías súper veloces. ¿Hablamos?";
      } else {
        draft_asunto = "Tu página en Wix está perdiendo clientes por carga lenta";
        draft_mensaje = "Hola,\n\nSoy Lauti de LauchAR. Estuve revisando tu web en Wix y vi que el tiempo de carga supera los límites recomendados, lo que penaliza tu posicionamiento en Google y hace que usuarios se vayan antes de ver tus productos.\n\nContamos con un 'Plan Migración Express' para pasarte a una tecnología web moderna que vuela. ¿Te gustaría agendar 10 mins para charlarlo?\n\nSaludos,\nLauti";
      }
    } else if (urlLower.includes('instagram.com')) {
      diagnostic = "🤖 IA: Tienen buen IG pero sin automatización. Ofrecé Landing + Turnos automatizados.";
      if (metodo_contacto === 'WhatsApp') {
        draft_mensaje = "¡Hola! Excelente el feed que tienen. Noté que cierran todo por MD y se les deben escapar dudas fuera de horario. Soy Lauti, hacemos sistemas de agenda integrados a su IG. ¿Les interesa?";
      } else {
        draft_asunto = "Automatizá tus ventas de Instagram 24/7";
        draft_mensaje = "Hola,\n\nSoy Lauti de LauchAR. Sigo su cuenta y el contenido es excelente. Sin embargo, depender solo de los Mensajes Directos hace perder clientes fuera del horario comercial.\n\nPodemos armarles una Landing Page conectada a su Instagram para recolectar reservas o cobros 24/7 de forma automática. ¿Les interesaría ver cómo funciona?\n\nSaludos,\nLauti";
      }
    } else if (urlLower.includes('facebook.com')) {
      diagnostic = "🤖 IA: Sin canal digital propio, atrapados en 2015. Urge digitalizarlos.";
      if (metodo_contacto === 'WhatsApp') {
        draft_mensaje = "¡Hola! Me crucé con su Facebook. Son un negocio sólido pero hoy es clave tener catálogo propio afuera de fb. Hacemos plataformas digitales súper ágiles. ¿Hablamos?";
      } else {
        draft_asunto = "El siguiente gran paso comercial fuera de Facebook";
        draft_mensaje = "Hola,\n\nSoy Lauti de LauchAR. Vi que concentran todas las operaciones en Facebook. Hoy en día, depender de un solo algoritmo limita mucho el crecimiento.\n\nQueremos armarles su canal digital propio: un e-commerce intuitivo que sea directamente de ustedes. ¿Les reservo una demo corta para que vean el potencial?\n\nSaludos,\nLauti";
      }
    } else if (urlLower.includes('tiendanube')) {
      diagnostic = "🤖 IA: Usan TiendaNube. Validar cuellos de botella con comisiones si escalaron.";
      if (metodo_contacto === 'WhatsApp') {
        draft_mensaje = "¡Hola! Veo que usan TiendaNube. Habiendo escalado seguramente las comisiones ya pesan. Soy Lauti de LauchAR, hacemos desarrollos a medida sin ataduras mensuales. ¿Te interesa reducir costos?";
      } else {
        draft_asunto = "Cómo dejar de pagar exageradas comisiones mensuales";
        draft_mensaje = "Hola,\n\nSoy Lauti de LauchAR. Al ver que usan TiendaNube, imagino que el e-commerce ya es parte central de sus ingresos. A medida que crezcan, esas comisiones pesarán más.\n\nDesarrollar una tienda propia elimina los recargos por transacción y les da 100% de control sobre el diseño. Estudiemos los números juntos. ¿Qué día te queda cómodo?\n\nSaludos,\nLauti";
      }
    } else {
      diagnostic = "🤖 IA: Error de conversión o falta de CRO evidente. Ofrecé nuestro rediseño funnel enfocado a WhatsApp.";
      if (metodo_contacto === 'WhatsApp') {
        draft_mensaje = "¡Hola! Pasaba por la web de la marca. Tiene buen potencial pero me di cuenta que perder clientes es fácil por cómo está armada la experiencia. Soy Lauti de LauchAR, ¿les interesa mejorar ese embudo hoy?";
      } else {
        draft_asunto = "Tu sitio web actual está dejando ventas sobre la mesa";
        draft_mensaje = "Hola,\n\nSoy Lauti de LauchAR. Analicé el panel frontal de su sitio y vi que faltan llamados a la acción claros. En resumen, mucha de la gente que entra se pierde sin dejar el contacto.\n\nPodemos hacer un rediseño UI/UX (Optimización de Conversión) con un funnel directo a tu WhatsApp de ventas. Es rápido y agresivo en resultados. ¿Charlamos unos minutos?\n\nSaludos,\nLauti";
      }
    }

    return NextResponse.json({ diagnostic, draft_asunto, draft_mensaje });

  } catch (error) {
    return NextResponse.json({ error: 'Error analizando URL' }, { status: 500 });
  }
}
