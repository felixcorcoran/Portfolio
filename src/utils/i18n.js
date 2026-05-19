const languages = {
  es: {
    // SEO Metas
    'seo.description': 'Portfolio de Félix Corcoran, Desarrollador Web Full Stack especializado en Astro, Tailwind CSS e integración de IA. Conoce mis proyectos como KaloAI.',

    // Hero & Intro
    'hero.title.1': 'Desarrollador',
    'hero.title.2': 'full stack',
    'hero.title.3': 'especialista en',
    'hero.title.4': ' ia',
    'hero.degree': 'Titulado en',
    'hero.desc': 'Construyo arquitecturas MVC robustas y orquesto flujos de trabajo inteligentes mediante n8n para escalar el potencial de productos digitales.',
    
    // Botones / Acciones comunes
    'btn.projects': 'Proyectos',
    'btn.cv': 'Currículum',
    'btn.download': 'Descargar',
    'btn.visit': 'Visitar Web',
    'btn.explore': 'Explorar',
    
    // Pilares Técnicos
    'tech.backend': 'Desarrollo de arquitecturas robustas y escalables bajo el patrón MVC, garantizando una lógica de servidor eficiente y una gestión de datos optimizada.',
    'tech.frontend': 'Fidelidad total en la implementación de diseños UI/UX complejos, transformando prototipos estáticos en interfaces dinámicas, responsivas y con una experiencia de usuario fluida.',
    'tech.automation': 'Automatización de procesos complejos mediante la orquestación de APIs de IA y el procesamiento avanzado de datos en formato JSON.',
    'tech.future': 'Ampliando mi stack con tecnologías modernas para construir interfaces reactivas, flujos de datos complejos y arquitecturas con tipado estricto.',
    
    // Sección Proyectos
    'projects.section.title': 'Mis',
    'projects.section.subtitle': 'Trabajos',
    'projects.kalo.desc': 'Plataforma nutricional avanzada con gestión de recetas mediante inteligencia artificial y sistema multi-rol.',
    'projects.kalo.tag': 'Plataforma IA',
    'projects.promo.desc': 'Desarrollo integral de plataforma web promocional con navegación fluida y fiel al diseño original.',
    'projects.promo.tag1': 'Diseño Funcional',
    'projects.promo.tag2': 'Experiencia de Usuario',
    'projects.freelance.label': 'Galería Freelance',
    'projects.freelance.title': 'Proyectos Realizados',
    'projects.freelance.sub': 'Desarrollo de Soluciones a Medida',
    'btn.open': 'ABRIR PROYECTO',
    
    // Formulario de Contacto
    'contact.available': 'Disponible para el desarrollo de soluciones de software a medida, integraciones de inteligencia artificial y optimización de plataformas digitales de alta escalabilidad.',
    'contact.label.name': 'nombre',
    'contact.label.email': 'correo',
    'contact.label.project': 'proyecto',
    'contact.placeholder.name': 'TU NOMBRE...',
    'contact.placeholder.email': 'TU CORREO...',
    'contact.placeholder.project': 'DESCRIPCIÓN DEL PROYECTO...',
    
    // Footer
    'footer.desc': 'Desarrollador full-stack especializado en orquestación de IA y sistemas MVC.'
  },
  en: {
    // SEO Metas
    'seo.description': 'Portfolio of Félix Corcoran, Full Stack Web Developer specialized in Astro, Tailwind CSS, and AI integration. Explore my work including KaloAI.',

    // Hero & Intro
    'hero.title.1': 'Full Stack',
    'hero.title.2': 'Developer',
    'hero.title.3': 'AI Integration',
    'hero.title.4': ' Specialist',
    'hero.degree': 'Graduated in',
    'hero.desc': 'Building robust MVC architectures and orchestrating intelligent workflows to scale the impact of digital products.',
    
    // Botones / Acciones comunes
    'btn.projects': 'Projects',
    'btn.cv': 'Get Resume',
    'btn.download': 'Download',
    'btn.visit': 'Visit Web',
    'btn.explore': 'Explore',
    
    // Pilares Técnicos
    'tech.backend': 'Developing robust, scalable backend systems using solid patterns, ensuring optimized database management and high-efficiency server logic.',
    'tech.frontend': 'Pixel-perfect UI/UX implementation, transforming static prototypes into dynamic, responsive, and fluid user experiences.',
    'tech.automation': 'Automating complex backend processes by orchestrating AI APIs and structuring complex JSON data pipelines.',
    'tech.future': 'Expanding my stack with modern frameworks to engineer reactive interfaces, real-time data streams, and strictly typed architectures.',
    
    // Sección Proyectos
    'projects.section.title': 'My',
    'projects.section.subtitle': 'Works',
    'projects.kalo.desc': 'Advanced nutritional engine featuring AI-powered recipe generation and complex multi-role access.',
    'projects.kalo.tag': 'AI Platform',
    'projects.promo.desc': 'Full-stack development of a high-fidelity promotional platform with fluid, optimized interactions.',
    'projects.promo.tag1': 'Functional Design',
    'projects.promo.tag2': 'User Experience',
    'projects.freelance.label': 'Freelance Gallery',
    'projects.freelance.title': 'Completed Projects',
    'projects.freelance.sub': 'Custom Software Development',
    'btn.open': 'OPEN PROJECT',
    
    // Formulario de Contacto
    'contact.available': 'Available for custom software development, advanced AI integrations, and high-performance digital platform optimization worldwide.',
    'contact.label.name': 'name',
    'contact.label.email': 'email',
    'contact.label.project': 'project',
    'contact.placeholder.name': 'YOUR NAME...',
    'contact.placeholder.email': 'YOUR EMAIL...',
    'contact.placeholder.project': 'PROJECT DESCRIPTION...',
    
    // Footer
    'footer.desc': 'Full-stack developer specialized in AI orchestration and scalable architectures.'
  }
};

export function useTranslations(lang) {
  return function t(key) {
    return languages[lang]?.[key] || languages['es'][key];
  };
}