/**
 * Todo lo que soy y he hecho, en un solo sitio y en los dos idiomas. De aquí
 * salen el currículum (cv/cv.mjs → PDF) y las secciones Stack, Experiencia y
 * Mis trabajos del portfolio. Al cambiar este archivo, una GitHub Action
 * vuelve a generar los PDF (.github/workflows/cv.yml).
 *
 * Reglas:
 * - Cada dato tiene que ser verdad y poder enseñarse. Lo que aún no sé se
 *   deja vacío ('') y simplemente no aparece.
 * - Solo sintaxis que Node entiende sin compilar (sin enums ni namespaces):
 *   el generador del CV importa este archivo directamente.
 */

export type Lang = 'es' | 'en';
export type Text = Record<Lang, string>;

/** Un texto igual en los dos idiomas, o uno por idioma */
export type Label = string | Text;
export const pick = (value: Label, lang: Lang) => (typeof value === 'string' ? value : value[lang]);

export interface Project {
	name: Label;
	url?: string;
	/** Repositorio público en GitHub, si lo hay */
	repo?: string;
	/** false: no sale en el CV (que tiene que caber en una página) */
	cv?: boolean;
	/** Etiqueta corta junto al nombre: «En desarrollo», «Uso interno»… */
	status?: Text;
	summary: Text;
	highlights: Text[];
	stack: string[];
	/** Cómo sale en Mis trabajos del portfolio. Sin esto, solo sale en el CV. */
	web?: {
		/** Rótulo pequeño encima del nombre */
		tag: Text;
		/** Lo que se lee al pasar el ratón, bajo «Visitar web», «Explorar» o «Ver caso» */
		hover?: Text;
		action?: 'visit' | 'explore' | 'case';
		/** Otra dirección para la web (p. ej. con /en, o el caso contado en otra página) */
		url?: Text;
		/** Letra o símbolo gigante de fondo */
		mark: string;
		/** Captura en src/assets/projects/<image>.jpg */
		image?: string;
		/** Qué parte de la captura se ve si hay que recortarla (object-position); por defecto, arriba a la izquierda */
		imagePos?: string;
		/** Tarjeta baja a todo el ancho, al final */
		wide?: boolean;
	};
}

export const persona = {
	name: 'Félix Corcoran',
	role: { es: 'Desarrollador Full-Stack', en: 'Full-Stack Developer' },
	focus: { es: 'Integración de IA y automatización', en: 'AI integration & automation' },
	location: 'Málaga',
	email: 'contacto@felixcorcoran.es',
	phone: '+34 673 350 029',
	links: {
		portfolio: 'https://dev.felixcorcoran.es',
		linkedin: 'https://www.linkedin.com/in/felixcorcoran',
		github: 'https://github.com/felixcorcoran',
		web: 'https://felixcorcoran.es',
	},
	summary: {
		es: 'Desarrollador full-stack titulado en DAW. Construyo webs y herramientas que conectan modelos de IA con procesos reales, y automatizo lo repetitivo con n8n. Trabajo con clientes reales desde la primera conversación hasta la entrega, y decido qué merece la pena construir antes de hacerlo.',
		en: 'Full-stack developer with a degree in Web Application Development (DAW). I build websites and tools that connect AI models to real processes, and automate repetitive work with n8n. I work with real clients from the first conversation to delivery, and decide what is worth building before building it.',
	},
};

export const experience: {
	role: Text;
	company: string;
	period: Text;
	highlights: Text[];
	clients: { name: string; url?: string }[];
	/** Etiquetas de la línea de tiempo del portfolio */
	tags: Label[];
}[] = [
	{
		role: { es: 'Desarrollador web freelance', en: 'Freelance web developer' },
		company: '',
		period: { es: '2025 – actualidad', en: '2025 – present' },
		highlights: [
			{
				es: 'Webs a medida para pequeños negocios sobre un sistema MVC en PHP, con reservas y citas online.',
				en: 'Custom websites for small businesses on a PHP MVC system, with online bookings and appointments.',
			},
			{
				es: 'Funciones y componentes según cada cliente, apoyándome en IA para acelerar la entrega.',
				en: 'Features and components tailored to each client, using AI tools to speed up delivery.',
			},
			{
				es: 'Trato directo con el cliente para definir, ajustar y entregar cada proyecto.',
				en: 'Direct contact with each client to define, adjust and deliver every project.',
			},
		],
		clients: [
			{ name: 'Pilar Peluquería', url: 'https://pilarpeluqueria.com' },
			{ name: 'MBH Builders', url: 'https://mbhbuilders.es' },
			{ name: 'Ávila Secretaría', url: 'https://avilasecretariaonline.com' },
			{ name: 'Reformas Paola', url: 'https://reformasymantenimientospaola.com' },
			{ name: 'Susana Nails', url: 'https://susanaflorianails.com' },
			{ name: 'Construcciones Omega', url: 'https://construccionesyserviciosomega.com' },
		],
		tags: ['MVC', { es: 'Reservas online', en: 'Online bookings' }, { es: 'Trato con cliente', en: 'Client-facing' }],
	},
	{
		role: { es: 'Desarrollador web en prácticas', en: 'Web developer intern' },
		company: 'Simply Trade In',
		period: { es: '2025 – 2026', en: '2025 – 2026' },
		highlights: [
			{
				es: 'Web promocional y de captación para el lanzamiento de una app social, fiel al diseño UI/UX.',
				en: 'Promotional and lead-generation website for the launch of a social app, true to the UI/UX design.',
			},
			{
				es: 'Workflows de IA en n8n (en Docker) para generar contenidos: imágenes, vídeos y textos.',
				en: 'AI workflows in n8n (running on Docker) to generate content: images, videos and text.',
			},
			{
				es: 'JSON como capa puente entre formularios web y motores de IA; panel en React con login.',
				en: 'JSON as the bridge between web forms and AI engines; React dashboard with login.',
			},
		],
		clients: [],
		tags: ['n8n', 'Docker', 'React', 'UI/UX'],
	},
];

export const projects: Project[] = [
	// Arriba los que se pueden visitar; abajo los que no tienen enlace
	{
		name: 'Kalo AI',
		url: 'https://kaloai.infinityfreeapp.com',
		repo: 'https://github.com/felixcorcoran/kaloAI',
		summary: {
			es: 'Plataforma de nutrición con recetas generadas por IA según calorías, objetivos e intolerancias.',
			en: 'Nutrition platform with AI-generated recipes based on calories, goals and intolerances.',
		},
		highlights: [
			{
				es: 'Multi-rol (usuario, nutricionista y administración), plan semanal e inventario con lista de la compra.',
				en: 'Multi-role (user, nutritionist and admin), weekly plan and inventory with a shopping list.',
			},
		],
		stack: ['PHP (MVC)', 'MySQL', 'Gemini API', 'JavaScript'],
		web: {
			tag: { es: 'Full Stack e IA', en: 'Full Stack & AI' },
			hover: { es: 'Plataforma IA', en: 'AI Platform' },
			action: 'explore',
			url: { es: 'https://kaloai.infinityfreeapp.com/?i=1', en: 'https://kaloai.infinityfreeapp.com/?i=1' },
			mark: 'AI',
			image: 'kalo',
		},
	},
	{
		name: { es: 'Diagnóstico web', en: 'Website check' },
		url: 'https://diagnostico.felixcorcoran.es',
		repo: 'https://github.com/felixcorcoran/diagnostico',
		summary: {
			es: 'Herramienta pública: escribes una web y dice qué se encuentra un cliente, solo con hechos comprobables.',
			en: 'Public tool: type a website and it shows what a customer finds, using only verifiable facts.',
		},
		highlights: [
			{
				es: 'Funciones serverless con protección SSRF; revisa enlaces, contacto, Google y vista previa.',
				en: 'Serverless functions with SSRF protection; checks links, contact, Google and link previews.',
			},
		],
		stack: ['Astro SSR', 'Node.js', 'TypeScript', 'Vercel'],
		web: {
			tag: { es: 'Herramienta pública', en: 'Public tool' },
			hover: { es: 'Prueba tu web', en: 'Test your website' },
			action: 'visit',
			url: { es: 'https://diagnostico.felixcorcoran.es', en: 'https://diagnostico.felixcorcoran.es/en' },
			mark: '✓',
			image: 'diagnostico',
		},
	},
	{
		name: { es: 'Radar de subvenciones', en: 'Grants radar' },
		url: 'https://subvenciones.felixcorcoran.es',
		repo: 'https://github.com/felixcorcoran/subvenciones',
		summary: {
			es: 'Recoge cada mañana las ayudas nuevas de toda España y dice a cuáles puede optar cada negocio.',
			en: 'Collects new Spanish grants every morning and shows which ones each business can apply for.',
		},
		highlights: [
			{
				es: 'API abierta de la BDNS y GitHub Actions; Gemini lee las bases y explica requisitos, importe y plazo en claro.',
				en: 'Open BDNS API and GitHub Actions; Gemini reads each call and explains requirements, amount and deadline plainly.',
			},
		],
		stack: ['Astro', 'TypeScript', 'Gemini API', 'GitHub Actions'],
		web: {
			tag: { es: 'Datos abiertos e IA', en: 'Open data & AI' },
			hover: { es: 'Busca tus ayudas', en: 'Find your grants' },
			action: 'visit',
			mark: '€',
			image: 'subvenciones',
			imagePos: 'center',
			wide: true,
		},
	},
	{
		name: 'felixcorcoran.es',
		url: 'https://felixcorcoran.es',
		repo: 'https://github.com/felixcorcoran/felixcorcoran-landing',
		summary: {
			es: 'Mi web de servicios: narrativa guiada por el scroll y escultura 3D con shaders propios.',
			en: 'My services website: scroll-driven storytelling and a 3D sculpture with custom shaders.',
		},
		highlights: [
			{
				es: 'Bilingüe, con SEO técnico y datos estructurados; modo claro y oscuro.',
				en: 'Bilingual, with technical SEO and structured data; light and dark mode.',
			},
		],
		stack: ['Astro', 'GSAP', 'Three.js', 'GLSL'],
		web: {
			tag: { es: 'Web y WebGL', en: 'Web & WebGL' },
			hover: { es: 'Web de servicios', en: 'Services website' },
			action: 'visit',
			url: { es: 'https://felixcorcoran.es', en: 'https://felixcorcoran.es/en' },
			mark: 'fc',
			image: 'felixcorcoran',
		},
	},
	{
		name: 'Portfolio',
		url: 'https://dev.felixcorcoran.es',
		// El CV ya enlaza el portfolio en la cabecera: aquí se queda fuera del CV
		cv: false,
		repo: 'https://github.com/felixcorcoran/Portfolio',
		summary: {
			es: 'Portfolio bilingüe con animaciones y contacto serverless; genera este currículum.',
			en: 'Bilingual portfolio with animations and serverless contact; it generates this resume.',
		},
		highlights: [
			{
				es: 'Arquitectura de islas para rendimiento y SEO; CV en PDF generado desde los datos.',
				en: 'Islands architecture for performance and SEO; PDF resume generated from data.',
			},
		],
		stack: ['Astro', 'Tailwind CSS', 'Resend', 'Vercel'],
		// Sin `web`: no se enseña a sí mismo en Mis trabajos
	},
	{
		name: 'Spain Trading Cards',
		status: { es: 'En desarrollo', en: 'In progress' },
		summary: {
			es: 'Tienda Shopify de cartas coleccionables diseñada desde cero, con secciones Liquid a medida.',
			en: 'Shopify store for collectible cards designed from scratch, with custom Liquid sections.',
		},
		highlights: [
			{
				es: 'Alta de productos desde Telegram: Gemini interpreta, n8n orquesta y la API de Shopify publica.',
				en: 'Product onboarding from Telegram: Gemini parses, n8n orchestrates, the Shopify API publishes.',
			},
		],
		stack: ['Shopify Liquid', 'GraphQL', 'n8n', 'Gemini API', 'Telegram'],
		web: {
			tag: { es: 'Automatización e IA', en: 'Automation & AI' },
			hover: { es: 'Del móvil a la tienda', en: 'From phone to store' },
			action: 'case',
			// La tienda aún no es pública: lleva al caso contado en felixcorcoran.es
			url: { es: 'https://felixcorcoran.es/#trabajo', en: 'https://felixcorcoran.es/en#work' },
			mark: 'TCG',
			image: 'stc',
			wide: true,
		},
	},
	{
		name: { es: 'Radar comercial', en: 'Lead radar' },
		status: { es: 'Uso interno', en: 'Internal tool' },
		summary: {
			es: 'Busca cada día negocios locales con un fallo comprobable y prepara a quién contactar.',
			en: 'Finds local businesses with a verifiable issue every day and prepares who to contact.',
		},
		highlights: [
			{
				es: 'El código comprueba los hechos; Gemini solo los interpreta. Cuotas de API bajo control.',
				en: 'Code checks the facts; Gemini only interprets them. API quotas kept under control.',
			},
		],
		stack: ['Node.js', 'GitHub Actions', 'Places API', 'Gemini API'],
		// Repositorio privado: sin enlace
		web: { tag: { es: 'Automatización e IA', en: 'Automation & AI' }, mark: '◎', image: 'radar' },
	},
];

export type SkillGroup = 'ai' | 'backend' | 'frontend' | 'integrations' | 'tools';

export const skills: { id: SkillGroup; label: Text; items: string[] }[] = [
	{ id: 'ai', label: { es: 'IA y automatización', en: 'AI & automation' }, items: ['n8n', 'OpenAI API', 'Claude API', 'Gemini API', 'JSON', 'REST'] },
	{ id: 'backend', label: { es: 'Backend', en: 'Backend' }, items: ['PHP', 'Laravel', 'Node.js', 'Java', 'Python', 'MySQL'] },
	{
		id: 'frontend',
		label: { es: 'Frontend', en: 'Frontend' },
		items: ['TypeScript', 'JavaScript', 'React', 'Astro', 'Tailwind CSS', 'Three.js', 'GSAP', 'Vite', 'HTML', 'CSS/Sass'],
	},
	{
		id: 'integrations',
		label: { es: 'Integraciones', en: 'Integrations' },
		items: ['Shopify (Liquid, GraphQL)', 'Telegram Bot API', 'Google Places API', 'Resend'],
	},
	{ id: 'tools', label: { es: 'Herramientas', en: 'Tools' }, items: ['Git', 'GitHub', 'GitHub Actions', 'Docker', 'Vercel', 'Postman'] },
];

/** Lo que estoy aprendiendo: sale en el portfolio (New horizons), no en el CV */
export const learning = ['Angular', 'Spring Boot', 'Next.js', 'Supabase', 'PostgreSQL'];

export const education = [
	{
		title: {
			es: 'Técnico Superior en Desarrollo de Aplicaciones Web (DAW)',
			en: 'Higher Technician in Web Application Development (DAW)',
		},
		center: 'IES Aguadulce',
		/** Terminado en marzo de 2026 */
		period: '2026',
	},
];

export const otherExperience: Text = {
	es: 'Atención al público y al cliente: información turística, comercio, hostelería y reparto.',
	en: 'Customer-facing roles: tourist information, retail, hospitality and delivery.',
};

export const languages = [
	{ name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' } },
	{ name: { es: 'Inglés', en: 'English' }, level: { es: 'Nativo', en: 'Native' } },
];
