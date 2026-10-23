/**
 * El currículum, en español (CV) e inglés (Resume), como HTML que se imprime
 * a PDF con Edge o Chrome sin cabeceras. Sustituye al PDF hecho a mano: para
 * añadir un proyecto basta con tocar los datos de abajo y volver a generarlo.
 *
 *   node cv/cv.mjs          → public/cv-felix-corcoran.pdf y public/resume-felix-corcoran.pdf
 *
 * Medidas en puntos, sacadas del PDF anterior (A4 = 595.5 × 842.25 pt) para
 * que se vea igual. Fuentes: Questrial y Open Sans, como el original; la
 * Cocomat Pro de los enlaces (de pago) se sustituye por Montserrat.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const asset = (file) => `data:image/${file.endsWith('.jpg') ? 'jpeg' : 'png'};base64,${readFileSync(join(here, 'assets', file)).toString('base64')}`;

const links = {
	linkedin: 'https://www.linkedin.com/in/felixcorcoran',
	github: 'https://github.com/felixjbk',
	portfolio: 'https://dev.felixcorcoran.es/',
	kalo: 'https://kaloai.infinityfreeapp.com/',
	fc: 'https://felixcorcoran.es/',
};

const freelance = [
	['PILAR PELUQUERIA', 'https://pilarpeluqueria.com/inicio.html'],
	['MBH BUILDERS'],
	['AVILA SECRETARIA'],
	['REFORMAS PAOLA'],
	['SUSANA NAILS', 'https://susanaflorianails.com/'],
	['CONSTR. OMEGA', 'https://construccionesyserviciosomega.com/'],
];

const data = {
	es: {
		file: 'cv-felix-corcoran.pdf',
		title: 'CV · Félix Corcoran',
		role: ['DESARROLLADOR FULL-STACK', 'AUTOMATIZACIÓN E INTEGRACIÓN DE IA'],
		summary:
			'Desarrollador Full-Stack titulado en DAW, especializado en la integración de IA (OpenAI, Anthropic Claude, Gemini) y la automatización de procesos con n8n. Experiencia real en producción conectando APIs de IA con aplicaciones web y construyendo sistemas escalables bajo el patrón MVC. Capacidad demostrada de adoptar rápidamente nuevas tecnologías apoyándose en IA. Acostumbrado a entornos remotos y a la comunicación directa con cliente.',
		experience: 'EXPERIENCIA',
		freelance: { title: 'FREELANCE', date: '(2025 - actualidad)', projects: 'PROYECTOS' },
		freelanceBullets: [
			'Adaptación y personalización de un sistema MVC existente en distintos proyectos web, con funcionalidades a medida como reservas y citas online.',
			'Desarrollo de funciones y componentes según las necesidades específicas de cada cliente, apoyándome en herramientas de IA para acelerar la entrega.',
			'Comunicación directa con el cliente para definir, ajustar y entregar cada proyecto web.',
		],
		internship: { title: 'DESARROLLADOR WEB (PRÁCTICAS) | SIMPLY TRADE IN', date: '(2025 - 2026)' },
		internshipBullets: [
			'Creación desde cero de la plataforma web promocional y de captación para el lanzamiento de una aplicación social, con fidelidad total al diseño UI/UX.',
			'Diseño e implementación de workflows de automatización con IA en n8n para la generación automática de contenidos (imágenes y textos).',
			'Procesamiento y transformación de JSON como capa puente entre formularios web y motores de IA.',
		],
		ownProjects: 'PROYECTOS PROPIOS',
		projects: [
			{
				title: 'KALOAI | PLATAFORMA CON IA',
				link: links.kalo,
				bullets: [
					'Generador inteligente de recetas basado en lenguaje natural e IA, filtrando por intolerancias y objetivos.',
					'Sistema multi-rol (Administrador, Nutricionista, Usuario) con gestión de carteras de clientes.',
					'Lógica de inventario automatizada: listas de la compra sincronizadas con el stock del usuario.',
				],
			},
			{
				title: 'MI PORTFOLIO PROFESIONAL',
				link: links.portfolio,
				bullets: [
					'Arquitectura basada en islas (Astro) para maximizar rendimiento y optimizar el SEO técnico.',
					'Animaciones dinámicas con Intersection Observer API para reforzar la narrativa visual.',
					'Gestión serverless de contactos con Resend y optimización de activos.',
				],
			},
			{
				title: 'SPAIN TRADING CARDS',
				note: '(Shopify · en desarrollo)',
				bullets: [
					'Tienda diseñada desde cero, con secciones Liquid a medida y cada resultado validado.',
					'Alta de productos desde Telegram: Gemini interpreta, n8n orquesta y la API de Shopify publica.',
					'Importación masiva desde CSV con la API GraphQL de Shopify, sin etiquetado manual.',
				],
			},
			{
				title: 'FELIXCORCORAN.ES',
				link: links.fc,
				bullets: [
					'Web de servicios con scroll narrativo (Astro, GSAP) y escultura 3D con shaders en Three.js.',
					'Diagnóstico web público y bilingüe: funciones serverless en Vercel con protección SSRF.',
					'Radar comercial diario (GitHub Actions, Google Places, Gemini) que detecta negocios con fallos.',
				],
			},
		],
		tech: 'TECNOLOGIAS Y HERRAMIENTAS',
		techLines: [
			['IA y Automatización', 'n8n · OpenAI API · Anthropic Claude API · Gemini API · JSON · API REST'],
			['Backend', 'PHP · Laravel · Node.js · Java · Python · MySQL'],
			['Frontend', 'React · Astro · Tailwind · Three.js · GSAP · Vite · HTML/CSS/Sass · JavaScript · TypeScript'],
			['Integraciones', 'Shopify (Liquid, GraphQL) · Telegram Bot API · Google Places API · Resend'],
			['Herramientas', 'Git · Docker · GitHub Actions (CI/CD) · Vercel · Postman · AJAX'],
		],
		languages: 'IDIOMAS',
		langs: [
			['ESPAÑOL', '(Nativo)'],
			['INGLÉS', '(Nativo)'],
		],
	},
	en: {
		file: 'resume-felix-corcoran.pdf',
		title: 'Resume · Félix Corcoran',
		role: ['FULL-STACK DEVELOPER &', 'AI AUTOMATION INTEGRATION'],
		summary:
			'Full-Stack Developer with a degree in DAW, specialized in AI integration (OpenAI, Anthropic Claude, Gemini) and process automation with n8n. Real-world production experience connecting AI APIs with web applications and building scalable systems under the MVC pattern. Demonstrated ability to quickly adopt new technologies leveraging AI. Accustomed to remote environments and direct client communication.',
		experience: 'EXPERIENCE',
		freelance: { title: 'FREELANCE', date: '(2025 - Present)', projects: 'PROJECTS' },
		freelanceBullets: [
			'Adaptation and customization of an existing MVC system across various web projects, featuring custom functionalities such as online bookings and appointments.',
			'Development of features and components tailored to the specific needs of each client, relying on AI tools to accelerate delivery.',
			'Direct communication with the client to define, adjust, and deliver each web project.',
		],
		internship: { title: 'WEB DEVELOPER (INTERNSHIP) | SIMPLY TRADE IN', date: '(2025 - 2026)' },
		internshipBullets: [
			'Creation from scratch of the promotional and lead-generation web platform for the launch of a social app, maintaining total fidelity to UI/UX design.',
			'Design and implementation of AI automation workflows in n8n for automated content generation (images, videos and text).',
			'Processing and transformation of JSON as a bridging layer between web forms and AI engines.',
		],
		ownProjects: 'PERSONAL PROJECTS',
		projects: [
			{
				title: 'KALOAI | AI-POWERED PLATFORM',
				link: links.kalo,
				bullets: [
					'Intelligent recipe generator based on natural language and AI, filtering by intolerances and goals.',
					'Multi-role system (Administrator, Nutritionist, User) with user management.',
					"Automated inventory logic: shopping lists synchronized with the user's stock.",
				],
			},
			{
				title: 'MY PROFESSIONAL PORTFOLIO',
				link: links.portfolio,
				bullets: [
					'Architecture based on islands (Astro) to maximize performance and optimize technical SEO.',
					'Dynamic animations with Intersection Observer API to reinforce visual storytelling.',
					'Serverless contact management with Resend and asset optimization.',
				],
			},
			{
				title: 'SPAIN TRADING CARDS',
				note: '(Shopify · in development)',
				bullets: [
					'Store designed from scratch, with custom Liquid sections and every result validated.',
					'Product onboarding from Telegram: Gemini parses, n8n orchestrates, the Shopify API publishes.',
					'Bulk CSV import with the Shopify GraphQL API, without manual tagging.',
				],
			},
			{
				title: 'FELIXCORCORAN.ES',
				link: links.fc,
				bullets: [
					'Services site with scroll-driven storytelling (Astro, GSAP) and 3D Three.js shaders.',
					'Public, bilingual website checker: Vercel serverless functions with SSRF protection.',
					'Daily lead radar (GitHub Actions, Google Places, Gemini) that spots businesses with issues.',
				],
			},
		],
		tech: 'TECHNOLOGIES & TOOLS',
		techLines: [
			['AI & Automation', 'n8n · OpenAI API · Anthropic Claude API · Gemini API · JSON · REST API'],
			['Backend', 'PHP · Laravel · Node.js · Java · Python · MySQL'],
			['Frontend', 'React · Astro · Tailwind · Three.js · GSAP · Vite · HTML/CSS/Sass · JavaScript · TypeScript'],
			['Integrations', 'Shopify (Liquid, GraphQL) · Telegram Bot API · Google Places API · Resend'],
			['Tools', 'Git · Docker · GitHub Actions (CI/CD) · Vercel · Postman · AJAX'],
		],
		languages: 'LANGUAGES',
		langs: [
			['SPANISH', '(Native)'],
			['ENGLISH', '(Native)'],
		],
	},
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const bullets = (items) => items.map((b) => `<p class="bullet">• ${esc(b)}</p>`).join('');
const linkLabel = (url) => (url ? `<a class="link" href="${url}">LINK</a>` : '');

function page(lang) {
	const t = data[lang];
	const project = (p) => `
		<div class="project">
			<h3>${esc(p.title)} ${p.link ? linkLabel(p.link) : `<span class="note">${esc(p.note)}</span>`}</h3>
			${bullets(p.bullets)}
		</div>`;
	return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(t.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400;700&family=Questrial&display=block" rel="stylesheet">
<style>
	@page { size: 595.5pt 842.25pt; margin: 0; }
	* { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; }
	body {
		width: 595.5pt;
		height: 842.25pt;
		overflow: hidden;
		position: relative;
		font-family: 'Questrial', sans-serif;
		color: #000;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
	a { color: inherit; text-decoration: none; }
	p, h1, h2, h3 { margin: 0; }

	/* ---------- Cabecera ---------- */
	.photo {
		position: absolute;
		left: 26pt;
		top: 20pt;
		width: 94pt;
		height: 94pt;
		border-radius: 50%;
		overflow: hidden;
	}
	.photo img { position: absolute; left: -3pt; top: -24pt; width: 98pt; height: 130pt; }
	h1 {
		position: absolute;
		left: 134pt;
		top: 9pt;
		font: 400 45.5pt/1.2 'Open Sans', sans-serif;
		white-space: nowrap;
	}
	.role {
		position: absolute;
		left: 129pt;
		top: 79pt;
		font-size: 12.6pt;
		line-height: 15pt;
		letter-spacing: 2.75pt;
		color: #8c8d94;
		white-space: nowrap;
	}
	.contact { position: absolute; left: 468pt; top: 80pt; font-size: 8.7pt; line-height: 11.6pt; }
	.contact p { display: flex; align-items: center; gap: 3pt; }
	.contact svg { width: 8pt; height: 8pt; fill: #8e929f; flex: none; }
	.social { position: absolute; display: block; }
	.social img { display: block; width: 100%; height: 100%; }
	.linkedin { left: 534pt; top: 27pt; width: 19pt; height: 19pt; }
	.github { left: 531pt; top: 56pt; width: 19.5pt; height: 20pt; }
	.portfolio { left: 560pt; top: 46pt; width: 20pt; height: 19pt; }
	.rule { position: absolute; left: 31pt; top: 119pt; width: 531pt; height: 2.25pt; background: #000; }

	/* ---------- Cuerpo ---------- */
	main { position: absolute; left: 30pt; top: 129pt; width: 533pt; }
	.summary {
		padding: 5pt 4pt 8pt 4.5pt;
		background: #8e929f;
		outline: 1.5pt solid #c3c6d2;
		outline-offset: -0.75pt;
		color: #fff;
		font-size: 12pt;
		line-height: 16.65pt;
		letter-spacing: 0.15pt;
	}
	.bar {
		height: 16pt;
		background: #c3c6d2;
		outline: 1.5pt solid #8e929f;
		outline-offset: -0.75pt;
		font: 700 10pt/16pt 'Open Sans', sans-serif;
		letter-spacing: 1pt;
		text-align: center;
	}
	.bullet { font-size: 10pt; line-height: 12.1pt; margin-top: 5.6pt; }
	.date { font-size: 11.1pt; color: #8c8d94; font-weight: 400; font-family: 'Questrial', sans-serif; }
	h2 { font: 700 14.1pt/19pt 'Open Sans', sans-serif; letter-spacing: 0.5pt; }

	.experience { margin-top: 7pt; }
	.freelance { position: relative; margin-top: 7pt; }
	.freelance h2 { text-align: center; padding-right: 30pt; }
	/* La lista de clientes va al lado sin empujar: el bloque mide lo que mide el texto */
	.side { position: absolute; right: 0; top: 0; width: 81pt; }
	.freelance .bullets { margin-top: -3pt; }
	.freelance .bullet { max-width: 440pt; }
	.side .bar { margin-top: 1pt; height: 19pt; line-height: 19pt; }
	.side ul { list-style: none; margin: 4pt 0 0 1pt; padding: 0; }
	.side li { font: 700 7pt/14.1pt 'Montserrat', sans-serif; color: #1c88c7; letter-spacing: 0.2pt; }
	.internship { margin-top: 9pt; }
	.internship h2 { padding-left: 7pt; }
	.internship .bullet { max-width: 520pt; }

	.own { margin-top: 10pt; }
	.own .bar { height: 19pt; line-height: 19pt; }
	.projects { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 23pt; row-gap: 7pt; margin-top: 3pt; }
	.project h3 { font: 700 13.1pt/18pt 'Open Sans', sans-serif; white-space: nowrap; }
	.project .link { font: 700 10pt 'Montserrat', sans-serif; color: #1c88c7; margin-left: 2pt; letter-spacing: 0.3pt; }
	.project .note { font: 400 10pt 'Questrial', sans-serif; color: #8c8d94; letter-spacing: 0; }
	.project .bullet { margin-top: 4.5pt; padding-right: 4pt; }

	.footer { position: absolute; left: 30pt; right: 32pt; bottom: 14pt; display: grid; grid-template-columns: 1fr 82pt; column-gap: 12pt; }
	.tech p { font: 400 9.6pt/14.4pt 'Open Sans', sans-serif; }
	.tech p:first-of-type { margin-top: 5pt; }
	.tech b { font-weight: 700; }
	.langs { text-align: center; }
	.langs .name { font: 700 15.3pt/20pt 'Open Sans', sans-serif; letter-spacing: 1pt; margin-top: 7pt; }
	.langs .level { font-size: 14.1pt; line-height: 16pt; color: #ff3131; }
</style>
</head>
<body>
	<div class="photo"><img src="${asset('foto.jpg')}" alt=""></div>
	<h1>FÉLIX CORCORAN</h1>
	<p class="role">${t.role.map(esc).join('<br>')}</p>
	<div class="contact">
		<p><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>Málaga</p>
		<p><svg viewBox="0 0 24 24"><path d="M2 5h20v14H2V5Zm2 2v.5l8 5 8-5V7H4Z"/></svg><a href="mailto:felixxjbk@gmail.com">felixxjbk@gmail.com</a></p>
		<p><svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg><a href="tel:+34673350029">+34 673350029</a></p>
	</div>
	<a class="social linkedin" href="${links.linkedin}"><img src="${asset('linkedin.png')}" alt="LinkedIn"></a>
	<a class="social github" href="${links.github}"><img src="${asset('github.png')}" alt="GitHub"></a>
	<a class="social portfolio" href="${links.portfolio}"><img src="${asset('portfolio.png')}" alt="Portfolio"></a>
	<div class="rule"></div>

	<main>
		<p class="summary">${esc(t.summary)}</p>

		<section class="experience">
			<h2 class="bar">${t.experience}</h2>
			<div class="freelance">
				<div>
					<h2>${t.freelance.title} <span class="date">${t.freelance.date}</span></h2>
					<div class="bullets">${bullets(t.freelanceBullets)}</div>
				</div>
				<div class="side">
					<p class="bar">${t.freelance.projects}</p>
					<ul>${freelance.map(([name, url]) => `<li>${url ? `<a href="${url}">${name}</a>` : name}</li>`).join('')}</ul>
				</div>
			</div>
			<div class="internship">
				<h2>${esc(t.internship.title)} <span class="date">${t.internship.date}</span></h2>
				${bullets(t.internshipBullets)}
			</div>
		</section>

		<section class="own">
			<h2 class="bar">${t.ownProjects}</h2>
			<div class="projects">${t.projects.map(project).join('')}</div>
		</section>
	</main>

	<div class="footer">
		<div class="tech">
			<h2 class="bar">${esc(t.tech)}</h2>
			${t.techLines.map(([label, items]) => `<p><b>${esc(label)}:</b> ${esc(items)}</p>`).join('')}
		</div>
		<div class="langs">
			<h2 class="bar">${t.languages}</h2>
			${t.langs.map(([name, level]) => `<p class="name">${name}</p><p class="level">${level}</p>`).join('')}
		</div>
	</div>
</body>
</html>`;
}

const browsers = [
	'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/usr/bin/google-chrome',
];
const browser = process.env.CV_BROWSER ?? browsers.find((b) => existsSync(b));
if (!browser) throw new Error('No encuentro Edge ni Chrome: indica la ruta en CV_BROWSER');

const outDir = join(here, 'out');
mkdirSync(outDir, { recursive: true });
for (const lang of process.argv.slice(2).length ? process.argv.slice(2) : ['es', 'en']) {
	const html = join(outDir, `${lang}.html`);
	writeFileSync(html, page(lang));
	const pdf = join(here, '..', 'public', data[lang].file);
	execFileSync(browser, [
		'--headless=new',
		'--disable-gpu',
		'--no-pdf-header-footer',
		'--virtual-time-budget=8000',
		`--print-to-pdf=${pdf}`,
		pathToFileURL(html).href,
	]);
	console.log(`${lang}: ${pdf}`);
}
