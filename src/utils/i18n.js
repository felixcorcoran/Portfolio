const languages = {
  es: {
    // SEO Metas
    'seo.description': 'Portfolio de Félix Corcoran, desarrollador full stack titulado en DAW: automatización con n8n, integración de IA (OpenAI, Claude, Gemini) y desarrollo web con Astro, React y Laravel.',

    // Hero & Intro
    'hero.title.1': 'Desarrollador',
    'hero.title.2': 'full stack',
    'hero.title.3': 'integración de',
    'hero.title.4': 'IA',
    'hero.degree': 'Titulado en',
    'hero.degree.short': 'DAW',
    'hero.desc': 'Conecto APIs de IA (OpenAI, Claude, Gemini) con aplicaciones web y automatizo procesos con n8n. Experiencia en producción con proyectos para clientes reales, sobre arquitecturas MVC y con trato directo con el cliente.',

    // Botones / Acciones comunes
    'btn.projects': 'Proyectos',
    'btn.cv': 'Currículum',
    'btn.download': 'Descargar',
    'btn.visit': 'Visitar web',
    'btn.explore': 'Explorar',

    // Pilares Técnicos
    'stack.tagline.1': 'Ingeniería y',
    'stack.tagline.2': 'automatización inteligente.',
    'tech.backend': 'Lógica de servidor y bases de datos bien estructuradas: PHP con MVC en producción, Laravel, Node.js con TypeScript para funciones serverless e integraciones, y Java y Python cuando el proyecto lo pide.',
    'tech.frontend': 'Interfaces fieles al diseño, responsivas y rápidas: de un prototipo estático a una experiencia fluida, con Astro, React, Tailwind CSS, GSAP y 3D en Three.js.',
    'tech.automation': 'Conecto modelos de IA con procesos reales: workflows en n8n, APIs de OpenAI, Claude y Gemini, y APIs de terceros como Shopify, Telegram o Google Places, con JSON como puente.',
    'tech.future': 'Profundizando en Next.js y Supabase para construir productos full stack con renderizado en servidor y datos en tiempo real.',

    // Experiencia
    'exp.label': 'Trayectoria',
    'exp.title': 'Experiencia',
    'exp.freelance.role': 'Desarrollador web freelance',
    'exp.freelance.period': '2025 — actualidad',
    'exp.freelance.desc': 'Webs para negocios locales sobre un sistema MVC propio, adaptado a cada cliente y con funciones a medida como reservas y citas online. Trato directo con el cliente de principio a fin.',
    'exp.sti.role': 'Desarrollador web (prácticas)',
    'exp.sti.period': '2025 — 2026',
    'exp.sti.desc': 'Plataforma web promocional para el lanzamiento de una app social, fiel al diseño UI/UX. Workflows de IA en n8n para generar contenido (imágenes y textos) y JSON como puente entre formularios y motores de IA.',

    // Sección Proyectos
    'projects.section.title': 'Mis',
    'projects.section.subtitle': 'Trabajos',
    'projects.kalo.desc': 'Plataforma nutricional con recetas generadas por IA según calorías, objetivos e intolerancias, sistema multi-rol (usuario, nutricionista y administración), planificación e inventario.',
    'projects.kalo.tag': 'Plataforma IA',
    'projects.kalo.chip1': 'Multi-rol',
    'projects.kalo.chip2': 'Recetas con IA',
    'projects.kalo.chip3': 'Planificación',
    'projects.stc.tag': 'Automatización e IA',
    'projects.stc.desc': 'Alta de productos desde Telegram para una tienda Shopify: Gemini interpreta el mensaje, n8n orquesta el flujo y la API de Shopify crea el producto con su taxonomía, título, descripción y etiquetas. Fotos, precio y stock siguen bajo control humano.',
    'projects.stc.hover': 'Del móvil a la tienda',
    'projects.stc.status': 'En desarrollo',
    'projects.fc.tag': 'Web y WebGL',
    'projects.fc.hover': 'Web de servicios',
    'projects.fc.desc': 'Mi web de servicios para negocios: una narrativa guiada por el scroll con Astro y GSAP, una escultura 3D con shaders propios en Three.js y SEO técnico con datos estructurados.',
    'projects.diag.name': 'Diagnóstico web',
    'projects.radar.name': 'Radar comercial',
    'projects.diag.tag': 'Herramienta pública',
    'projects.diag.hover': 'Prueba tu web',
    'projects.diag.desc': 'Escribes la dirección de una web y en segundos dice qué se encuentra un cliente: si carga, si es segura, enlaces rotos, teléfono sin enlace o vista previa al compartir. Solo hechos comprobables, en español e inglés.',
    'projects.radar.tag': 'Automatización e IA',
    'projects.radar.status': 'Uso interno',
    'projects.radar.desc': 'Busca cada día negocios locales con un fallo comprobable en su web o su ficha de Google y me deja una lista corta de a quién escribir. Gemini interpreta solo los hechos que ha comprobado el código; el contacto lo hago yo.',
    'btn.case': 'Ver caso',
    'projects.freelance.label': 'Galería freelance',
    'projects.freelance.title': 'Webs para negocios',
    'projects.freelance.sub': 'Diseño y desarrollo a medida',
    'btn.open': 'Abrir proyecto',

    // Formulario de Contacto
    'contact.label': 'Contacto',
    'contact.available': 'Disponible para desarrollo web a medida, automatizaciones e integraciones de IA. En remoto o en Málaga.',
    'contact.meta.email': 'Email',
    'contact.meta.location': 'Ubicación',
    'contact.meta.status': 'Estado',
    'contact.location': 'Málaga, ES / Remoto',
    'contact.status': 'Disponible',
    'contact.label.name': 'nombre',
    'contact.label.email': 'correo',
    'contact.label.project': 'proyecto',
    'contact.placeholder.name': 'Tu nombre...',
    'contact.placeholder.email': 'Tu correo...',
    'contact.placeholder.project': 'Cuéntame qué quieres construir...',
    'contact.send': 'Enviar mensaje',
    'contact.sending': 'Enviando...',
    'contact.sent': 'Enviado',
    'contact.success': '> Mensaje enviado. Te respondo pronto.',
    'contact.error': 'Error — inténtalo de nuevo',
    'contact.failed': 'Sin conexión — inténtalo de nuevo',

    // Footer
    'footer.desc': 'Desarrollador full stack: web, automatización e integración de IA.',
    'footer.business': '¿Tienes un negocio?'
  },
  en: {
    // SEO Metas
    'seo.description': 'Portfolio of Félix Corcoran, full stack developer: n8n automation, AI integration (OpenAI, Claude, Gemini) and web development with Astro, React and Laravel.',

    // Hero & Intro
    'hero.title.1': 'Full stack',
    'hero.title.2': 'developer',
    'hero.title.3': 'AI',
    'hero.title.4': 'integration',
    'hero.degree': 'Web Application Development graduate',
    'hero.degree.short': '(DAW)',
    'hero.desc': 'I connect AI APIs (OpenAI, Claude, Gemini) with web applications and automate processes with n8n. Production experience on real client projects, built on MVC architectures with direct client communication.',

    // Botones / Acciones comunes
    'btn.projects': 'Projects',
    'btn.cv': 'Resume',
    'btn.download': 'Download',
    'btn.visit': 'Visit site',
    'btn.explore': 'Explore',

    // Pilares Técnicos
    'stack.tagline.1': 'Engineering meets',
    'stack.tagline.2': 'intelligent automation.',
    'tech.backend': 'Well-structured server logic and databases: PHP with MVC in production, Laravel, Node.js with TypeScript for serverless functions and integrations, and Java and Python when the project calls for it.',
    'tech.frontend': 'Interfaces true to the design, responsive and fast: from a static prototype to a fluid experience, with Astro, React, Tailwind CSS, GSAP and 3D in Three.js.',
    'tech.automation': 'I connect AI models with real processes: n8n workflows, OpenAI, Claude and Gemini APIs, and third-party APIs such as Shopify, Telegram or Google Places, with JSON as the bridge.',
    'tech.future': 'Going deeper into Next.js and Supabase to build full stack products with server-side rendering and real-time data.',

    // Experience
    'exp.label': 'Background',
    'exp.title': 'Experience',
    'exp.freelance.role': 'Freelance web developer',
    'exp.freelance.period': '2025 — present',
    'exp.freelance.desc': 'Websites for local businesses on my own MVC system, adapted to each client with custom features such as online bookings and appointments. Direct client communication from start to finish.',
    'exp.sti.role': 'Web developer (internship)',
    'exp.sti.period': '2025 — 2026',
    'exp.sti.desc': 'Promotional web platform for the launch of a social app, true to the UI/UX design. AI workflows in n8n to generate content (images and text) and JSON as the bridge between forms and AI engines.',

    // Sección Proyectos
    'projects.section.title': 'My',
    'projects.section.subtitle': 'Works',
    'projects.kalo.desc': 'Nutrition platform with AI-generated recipes based on calories, goals and intolerances, a multi-role system (user, nutritionist and admin), meal planning and inventory.',
    'projects.kalo.tag': 'AI Platform',
    'projects.kalo.chip1': 'Multi-role',
    'projects.kalo.chip2': 'AI recipes',
    'projects.kalo.chip3': 'Meal planning',
    'projects.stc.tag': 'Automation & AI',
    'projects.stc.desc': 'Product onboarding from Telegram for a Shopify store: Gemini parses the message, n8n orchestrates the flow and the Shopify API creates the product with its taxonomy, title, description and tags. Photos, price and stock stay under human control.',
    'projects.stc.hover': 'From phone to store',
    'projects.stc.status': 'In progress',
    'projects.fc.tag': 'Web & WebGL',
    'projects.fc.hover': 'Services website',
    'projects.fc.desc': 'My services website for businesses: a scroll-driven narrative built with Astro and GSAP, a 3D sculpture with custom Three.js shaders, and technical SEO with structured data.',
    'projects.diag.name': 'Website check',
    'projects.radar.name': 'Lead radar',
    'projects.diag.tag': 'Public tool',
    'projects.diag.hover': 'Test your website',
    'projects.diag.desc': 'Type a website address and in seconds it shows what a customer finds: whether it loads, whether it is secure, broken links, phone numbers that cannot be tapped or link previews. Only verifiable facts, in Spanish and English.',
    'projects.radar.tag': 'Automation & AI',
    'projects.radar.status': 'Internal tool',
    'projects.radar.desc': 'Every day it finds local businesses with a verifiable problem on their website or Google profile and gives me a short list of who to contact. Gemini only interprets the facts the code has checked; I do the outreach myself.',
    'btn.case': 'View case',
    'projects.freelance.label': 'Freelance gallery',
    'projects.freelance.title': 'Websites for businesses',
    'projects.freelance.sub': 'Custom design and development',
    'btn.open': 'Open project',

    // Formulario de Contacto
    'contact.label': 'Contact',
    'contact.available': 'Available for custom web development, automations and AI integrations. Remote or in Málaga.',
    'contact.meta.email': 'Email',
    'contact.meta.location': 'Location',
    'contact.meta.status': 'Status',
    'contact.location': 'Málaga, ES / Remote',
    'contact.status': 'Available',
    'contact.label.name': 'name',
    'contact.label.email': 'email',
    'contact.label.project': 'project',
    'contact.placeholder.name': 'Your name...',
    'contact.placeholder.email': 'Your email...',
    'contact.placeholder.project': 'Tell me what you want to build...',
    'contact.send': 'Send message',
    'contact.sending': 'Sending...',
    'contact.sent': 'Sent',
    'contact.success': "> Message sent. I'll get back to you soon.",
    'contact.error': 'Error — please try again',
    'contact.failed': 'Connection failed — please try again',

    // Footer
    'footer.desc': 'Full stack developer: web, automation and AI integration.',
    'footer.business': 'Running a business?'
  }
};

export function useTranslations(lang) {
  return function t(key) {
    return languages[lang]?.[key] || languages['es'][key];
  };
}
