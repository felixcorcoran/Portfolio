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

    // Sección Proyectos
    'projects.section.title': 'Mis',
    'projects.section.subtitle': 'Trabajos',
    'btn.case': 'Ver caso',
    'btn.code': 'Código',
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

    // Nuevos (portada, stack, contacto, pie)
    'hero.remote': 'Disponible en remoto',
    'hero.bilingual': 'Bilingüe ES / EN',
    'hero.side': 'Lógica • Diseño • Inteligencia • 2026',
    'stack.backend': 'Backend',
    'stack.backend.text': 'PHP con MVC en producción, Laravel y Node.js con TypeScript para funciones serverless e integraciones.',
    'stack.frontend': 'Frontend',
    'stack.frontend.text': 'Interfaces fieles al diseño, rápidas y responsivas, con animación (GSAP) y 3D (Three.js).',
    'stack.ai': 'IA y automatización',
    'stack.ai.text': 'Workflows en n8n y APIs de IA conectadas a procesos reales y a servicios como Shopify o Telegram.',
    'stack.tools': 'Herramientas',
    'stack.tools.text': 'Control de versiones, CI/CD con GitHub Actions, contenedores y despliegue en Vercel.',
    'stack.learning': 'Ahora aprendiendo',
    'contact.title.1': '¿Hablamos?',
    'contact.title.2': 'Escríbeme.',
    'footer.built': 'Hecho con Astro y Tailwind CSS',
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

    // Sección Proyectos
    'projects.section.title': 'My',
    'projects.section.subtitle': 'Works',
    'btn.case': 'View case',
    'btn.code': 'Code',
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

    // New (hero, stack, contact, footer)
    'hero.remote': 'Remote ready',
    'hero.bilingual': 'Bilingual ES / EN',
    'hero.side': 'Logic • Design • Intelligence • 2026',
    'stack.backend': 'Backend',
    'stack.backend.text': 'PHP with MVC in production, Laravel and Node.js with TypeScript for serverless functions and integrations.',
    'stack.frontend': 'Frontend',
    'stack.frontend.text': 'Interfaces true to the design, fast and responsive, with animation (GSAP) and 3D (Three.js).',
    'stack.ai': 'AI & automation',
    'stack.ai.text': 'n8n workflows and AI APIs connected to real processes and to services such as Shopify or Telegram.',
    'stack.tools': 'Tools',
    'stack.tools.text': 'Version control, CI/CD with GitHub Actions, containers and deployment on Vercel.',
    'stack.learning': 'Currently learning',
    'contact.title.1': 'Let\x27s',
    'contact.title.2': 'Talk.',
    'footer.built': 'Built with Astro and Tailwind CSS',
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
