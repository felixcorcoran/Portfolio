/**
 * Todo lo que soy y he hecho, en un solo sitio y en los dos idiomas. De aquí
 * sale el currículum (cv/cv.mjs → PDF) y, poco a poco, la propia web.
 *
 * Reglas:
 * - Cada dato tiene que ser verdad y poder enseñarse. Lo que aún no sé se
 *   deja vacío ('') y simplemente no aparece.
 * - Solo sintaxis que Node entiende sin compilar (sin enums ni namespaces):
 *   el generador del CV importa este archivo directamente.
 */

export type Lang = 'es' | 'en';
export type Text = Record<Lang, string>;

export interface Project {
	/** Un texto si se llama igual en los dos idiomas */
	name: string | Text;
	url?: string;
	/** Etiqueta corta junto al nombre: «En desarrollo», «Uso interno»… */
	status?: Text;
	summary: Text;
	highlights: Text[];
	stack: string[];
}

export const persona = {
	name: 'Félix Corcoran',
	role: { es: 'Desarrollador Full-Stack', en: 'Full-Stack Developer' },
	focus: { es: 'Integración de IA y automatización', en: 'AI integration & automation' },
	location: 'Málaga',
	email: 'felixxjbk@gmail.com',
	phone: '+34 673 350 029',
	links: {
		portfolio: 'https://dev.felixcorcoran.es',
		linkedin: 'https://www.linkedin.com/in/felixcorcoran',
		github: 'https://github.com/felixjbk',
		web: 'https://felixcorcoran.es',
	},
	summary: {
		es: 'Desarrollador full-stack titulado en DAW. Construyo webs y herramientas que conectan modelos de IA (OpenAI, Claude, Gemini) con procesos reales, y automatizo lo repetitivo con n8n. Trabajo con clientes reales desde la primera conversación hasta la entrega, y decido qué merece la pena construir antes de hacerlo.',
		en: 'Full-stack developer with a degree in Web Application Development (DAW). I build websites and tools that connect AI models (OpenAI, Claude, Gemini) to real processes, and automate repetitive work with n8n. I work with real clients from the first conversation to delivery, and decide what is worth building before building it.',
	},
};

export const experience = [
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
			{ name: 'MBH Builders' },
			{ name: 'Ávila Secretaría' },
			{ name: 'Reformas Paola' },
			{ name: 'Susana Nails', url: 'https://susanaflorianails.com' },
			{ name: 'Construcciones Omega', url: 'https://construccionesyserviciosomega.com' },
		],
	},
	{
		role: { es: 'Desarrollador web (prácticas)', en: 'Web developer (internship)' },
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
	},
];

export const projects: Project[] = [
	{
		name: 'Kalo AI',
		url: 'https://kaloai.infinityfreeapp.com',
		status: { es: 'Proyecto final DAW', en: 'DAW final project' },
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
	},
	{
		name: 'felixcorcoran.es',
		url: 'https://felixcorcoran.es',
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
	},
	{
		name: { es: 'Diagnóstico web', en: 'Website check' },
		url: 'https://diagnostico.felixcorcoran.es',
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
	},
	{
		name: 'Portfolio',
		url: 'https://dev.felixcorcoran.es',
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
	},
];

export const skills: { label: Text; items: string[] }[] = [
	{ label: { es: 'IA y automatización', en: 'AI & automation' }, items: ['n8n', 'OpenAI API', 'Claude API', 'Gemini API', 'JSON', 'REST'] },
	{ label: { es: 'Backend', en: 'Backend' }, items: ['PHP', 'Laravel', 'Node.js', 'Java', 'Python', 'MySQL'] },
	{
		label: { es: 'Frontend', en: 'Frontend' },
		items: ['TypeScript', 'JavaScript', 'React', 'Astro', 'Tailwind CSS', 'Three.js', 'GSAP', 'Vite', 'HTML', 'CSS/Sass'],
	},
	{ label: { es: 'Integraciones', en: 'Integrations' }, items: ['Shopify (Liquid, GraphQL)', 'Telegram Bot API', 'Google Places API', 'Resend'] },
	{ label: { es: 'Herramientas', en: 'Tools' }, items: ['Git', 'GitHub Actions', 'Docker', 'Vercel', 'Postman'] },
];

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
	es: 'Atención al público y al cliente (2019 – 2023): información turística, comercio, hostelería y reparto.',
	en: 'Customer-facing roles (2019 – 2023): tourist information, retail, hospitality and delivery.',
};

export const languages = [
	{ name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' } },
	{ name: { es: 'Inglés', en: 'English' }, level: { es: 'Nativo', en: 'Native' } },
];
