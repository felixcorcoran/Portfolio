/**
 * El currículum, en español (CV) e inglés (Resume), generado a partir de
 * src/data/perfil.ts: se cambian los datos y se vuelve a generar.
 *
 *   npm run cv        → public/cv-felix-corcoran.pdf y public/resume-felix-corcoran.pdf
 *
 * Es HTML impreso a PDF con Edge o Chrome sin cabeceras. Pensado para que lo
 * lea bien un ATS: texto real, una columna de lectura, enlaces escritos tal
 * cual y sin texto dentro de imágenes. Color: azul marino apagado y grises,
 * sobrio, como se espera en un CV (no los colores de las webs).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { persona, experience, projects, skills, education, otherExperience, languages } from '../src/data/perfil.ts';

const here = dirname(fileURLToPath(import.meta.url));
const photo = `data:image/jpeg;base64,${readFileSync(join(here, 'assets', 'foto.jpg')).toString('base64')}`;

// Fuentes estáticas (no variables): así el PDF las incrusta como TrueType y
// un ATS lee el texto sin problemas. Las de Google Fonts salen como Type3.
const font = (pkg, file) => pathToFileURL(join(here, '..', 'node_modules', '@fontsource', pkg, 'files', file)).href;
const fontFaces = [
	['Inter', 400], ['Inter', 500], ['Inter', 600], ['Sora', 300], ['Sora', 600],
]
	.map(([family, weight]) => {
		const pkg = family.toLowerCase();
		return `@font-face { font-family: '${family}'; font-weight: ${weight}; src: url(${font(pkg, `${pkg}-latin-${weight}-normal.woff2`)}) format('woff2'); }`;
	})
	.join('\n');

const files = { es: 'cv-felix-corcoran.pdf', en: 'resume-felix-corcoran.pdf' };
const labels = {
	es: {
		title: 'CV · Félix Corcoran',
		profile: 'Perfil',
		experience: 'Experiencia',
		projects: 'Proyectos',
		skills: 'Habilidades',
		education: 'Formación',
		languages: 'Idiomas',
		other: 'Otra experiencia',
		clients: 'Clientes',
	},
	en: {
		title: 'Resume · Félix Corcoran',
		profile: 'Profile',
		experience: 'Experience',
		projects: 'Projects',
		skills: 'Skills',
		education: 'Education',
		languages: 'Languages',
		other: 'Other experience',
		clients: 'Clients',
	},
};

// Iconos vectoriales (Simple Icons para LinkedIn y GitHub): nítidos a cualquier tamaño
const icon = {
	pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/>',
	mail: '<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5-8-5ZM5.2 7 12 11.2 18.8 7H5.2Z"/>',
	phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"/>',
	globe: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-3a15.7 15.7 0 0 0-1.4-3.9A8 8 0 0 1 18.9 8ZM12 4.1c.8 1.1 1.5 2.4 1.9 3.9h-3.8c.4-1.5 1.1-2.8 1.9-3.9ZM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3Zm.8 2h3c.3 1.4.8 2.7 1.4 3.9A8 8 0 0 1 5.1 16Zm3-8h-3a8 8 0 0 1 4.4-3.9C8.9 5.3 8.4 6.6 8.1 8ZM12 19.9c-.8-1.1-1.5-2.4-1.9-3.9h3.8c-.4 1.5-1.1 2.8-1.9 3.9Zm2.3-5.9H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4Zm.2 5.9c.6-1.2 1.1-2.5 1.4-3.9h3a8 8 0 0 1-4.4 3.9Zm1.8-5.9a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4h-3.4Z"/>',
	linkedin:
		'<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
	github:
		'<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
};
const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icon[name]}</svg>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** La dirección tal cual, sin https:// ni www: es lo que se lee impreso */
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const link = (url, text = bare(url)) => `<a href="${url}">${esc(text)}</a>`;

function page(lang) {
	const l = labels[lang];
	const section = (title, body, cls = '') => `<section class="${cls}"><h2>${l[title]}</h2>${body}</section>`;

	const contact = [
		['pin', esc(persona.location)],
		['mail', link(`mailto:${persona.email}`, persona.email)],
		['phone', link(`tel:${persona.phone.replace(/\s/g, '')}`, persona.phone)],
		['globe', link(persona.links.portfolio)],
		['linkedin', link(persona.links.linkedin)],
		['github', link(persona.links.github)],
	]
		.map(([name, html]) => `<li class="c-${name}">${svg(name)}<span>${html}</span></li>`)
		.join('');

	const jobs = experience
		.map(
			(job) => `
		<article class="job">
			<header>
				<h3>${esc(job.role[lang])}${job.company ? ` <span class="at">· ${esc(job.company)}</span>` : ''}</h3>
				<span class="period">${esc(job.period[lang])}</span>
			</header>
			<ul class="dots">${job.highlights.map((h) => `<li>${esc(h[lang])}</li>`).join('')}</ul>
			${
				job.clients.length
					? `<p class="clients"><b>${l.clients}:</b> ${job.clients.map((c) => (c.url ? link(c.url, c.name) : esc(c.name))).join(' · ')}</p>`
					: ''
			}
		</article>`,
		)
		.join('');

	const work = projects
		.map(
			(p) => `
		<article class="project">
			<header>
				<h3>${esc(typeof p.name === 'string' ? p.name : p.name[lang])}</h3>
				${p.status ? `<span class="status">${esc(p.status[lang])}</span>` : ''}
				${p.url ? `<a class="url" href="${p.url}">${esc(bare(p.url))}</a>` : ''}
			</header>
			<p class="summary">${esc(p.summary[lang])}</p>
			${p.highlights.map((h) => `<p class="detail">${esc(h[lang])}</p>`).join('')}
			<p class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</p>
		</article>`,
		)
		.join('');

	const skillRows = skills.map((s) => `<p><b>${esc(s.label[lang])}</b><span>${s.items.map(esc).join(' · ')}</span></p>`).join('');
	const studies = education
		.map((e) => {
			const where = [e.center, e.period].filter(Boolean);
			return `<p class="degree"><b>${esc(e.title[lang])}</b>${where.length ? `<span>${where.map(esc).join(' · ')}</span>` : ''}</p>`;
		})
		.join('');
	const langs = languages.map((x) => `<p><b>${esc(x.name[lang])}</b> <span>${esc(x.level[lang])}</span></p>`).join('');

	return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(l.title)}</title>
<style>
${fontFaces}
	@page { size: A4; margin: 0; }
	:root {
		--ink: #18181b;
		--muted: #5c5d66;
		--soft: #8a8b94;
		--rule: #e8e3df;
		--accent: #3d5a7a;
		--accent-text: #1f3a5a;
		--accent-line: #c9d3de;
		--chip: #eef1f5;
		--chip-text: #2d4258;
		/* Multiplica los espacios verticales: lo ajusta el script del final
		   para que el contenido llene la página, ni más ni menos */
		--fit: 1;
	}
	* { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; }
	html { height: 297mm; overflow: hidden; }
	body {
		width: 210mm;
		height: 297mm;
		overflow: hidden;
		padding: 28pt 36pt 22pt;
		font: 400 8.5pt/1.4 'Inter', sans-serif;
		color: var(--ink);
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
	a { color: inherit; text-decoration: none; }
	p, h1, h2, h3, ul { margin: 0; padding: 0; }

	/* ---------- Cabecera ---------- */
	.top { display: grid; grid-template-columns: 80pt 1fr; column-gap: 18pt; align-items: center; }
	.photo { width: 80pt; height: 80pt; border-radius: 50%; overflow: hidden; background: #eee; }
	.photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
	h1 { font: 300 27pt/1 'Sora', sans-serif; letter-spacing: -0.035em; }
	h1 b { font-weight: 600; }
	.role { margin-top: 5pt; font-size: 10.5pt; font-weight: 500; }
	.role span { color: var(--accent-text); font-weight: 400; }
	.contact {
		display: flex;
		flex-wrap: wrap;
		gap: 3pt 13pt;
		margin-top: 9pt;
		list-style: none;
		font-size: 8.2pt;
		color: var(--muted);
	}
	.contact li { display: inline-flex; align-items: center; gap: 4pt; white-space: nowrap; }
	.contact svg { width: 8.5pt; height: 8.5pt; fill: var(--accent); flex: none; }
	.contact .c-linkedin svg, .contact .c-github svg { fill: var(--ink); }

	/* ---------- Secciones ---------- */
	section { margin-top: calc(11pt * var(--fit)); }
	h2 {
		display: flex;
		align-items: center;
		gap: 8pt;
		margin-bottom: calc(5pt * var(--fit));
		font: 600 8pt/1 'Sora', sans-serif;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--accent-text);
	}
	h2::after { content: ''; flex: 1; height: 0.75pt; background: var(--rule); }
	.profile p { font-size: 8.8pt; line-height: 1.48; color: #2a2b31; }

	/* Viñetas de lista de verdad (no dibujadas aparte): el texto se lee en su orden */
	.dots { padding-left: 10pt; }
	.dots li { margin-top: calc(1.5pt * var(--fit)); padding-left: 1pt; }
	.dots li::marker { color: var(--accent); font-size: 0.9em; }

	.job + .job { margin-top: calc(6pt * var(--fit)); }
	.job header, .project header { display: flex; align-items: baseline; gap: 8pt; }
	.job h3 { font: 600 9.8pt/1.3 'Inter', sans-serif; }
	.job .at { font-weight: 500; color: var(--muted); }
	.period { margin-left: auto; font-size: 8.2pt; color: var(--soft); white-space: nowrap; }
	.clients { margin-top: calc(4pt * var(--fit)); padding-left: 10pt; font-size: 8.2pt; color: var(--muted); }
	.clients b { color: var(--ink); font-weight: 500; }
	.clients a { color: var(--ink); border-bottom: 0.6pt solid var(--accent-line); }

	/* Proyectos: rejilla de dos, separados por líneas finas */
	.projects { display: grid; grid-template-columns: 1fr 1fr; column-gap: 22pt; }
	.project { padding: calc(6pt * var(--fit)) 0; border-top: 0.75pt solid var(--rule); }
	.project:nth-child(-n + 2) { border-top: 0; padding-top: 0; }
	.project h3 { font: 600 10pt/1.3 'Sora', sans-serif; letter-spacing: -0.01em; }
	.status {
		padding: 0.5pt 5pt;
		border: 0.6pt solid var(--accent-line);
		border-radius: 8pt;
		font-size: 6.6pt;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--accent-text);
		white-space: nowrap;
	}
	.url { margin-left: auto; font-size: 7.6pt; color: var(--soft); white-space: nowrap; }
	.project .summary { margin-top: 2.5pt; }
	.project .detail { margin-top: 2pt; color: var(--muted); }
	.stack { display: flex; flex-wrap: wrap; gap: 3pt; margin-top: calc(4pt * var(--fit)); }
	.stack span {
		padding: 1pt 5pt;
		border-radius: 3pt;
		background: var(--chip);
		color: var(--chip-text);
		font-size: 6.9pt;
		font-weight: 500;
	}

	/* Habilidades a la izquierda; formación, idiomas y lo demás a la derecha */
	.bottom { display: grid; grid-template-columns: 1.7fr 1fr; column-gap: 22pt; }
	.skills p { display: grid; grid-template-columns: 92pt 1fr; column-gap: 8pt; padding: calc(2.2pt * var(--fit)) 0; border-bottom: 0.6pt solid var(--rule); }
	.skills p:last-child { border-bottom: 0; }
	.skills b { font-weight: 600; }
	.skills span { color: #2f3036; }
	.degree b { display: block; font-weight: 600; }
	.degree span { color: var(--muted); }
	.langs p + p { margin-top: 1.5pt; }
	.langs span { color: var(--muted); }
	.other p { color: var(--muted); }
</style>
</head>
<body>
<div class="sheet">
	<header class="top">
		<div class="photo"><img src="${photo}" alt=""></div>
		<div>
			<h1>Félix <b>Corcoran</b></h1>
			<p class="role">${esc(persona.role[lang])} <span>· ${esc(persona.focus[lang])}</span></p>
			<ul class="contact">${contact}</ul>
		</div>
	</header>

	${section('profile', `<p>${esc(persona.summary[lang])}</p>`, 'profile')}
	${section('experience', jobs)}
	${section('projects', `<div class="projects">${work}</div>`)}

	<div class="bottom">
		${section('skills', skillRows, 'skills')}
		<div class="side">
			${section('education', studies)}
			${section('languages', langs, 'langs')}
			${otherExperience ? section('other', `<p>${esc(otherExperience[lang])}</p>`, 'other') : ''}
		</div>
	</div>
</div>
<script>
	// Reparte el espacio sobrante: busca el mayor --fit con el que la hoja aún
	// cabe en la página (entre 0.6 y 2). Así no queda hueco abajo ni apretado,
	// pase lo que pase en perfil.ts.
	document.fonts.ready.then(() => {
		const root = document.documentElement;
		const sheet = document.querySelector('.sheet');
		const style = getComputedStyle(document.body);
		const room = document.body.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
		let lo = 0.6;
		let hi = 2;
		for (let i = 0; i < 18; i++) {
			const mid = (lo + hi) / 2;
			root.style.setProperty('--fit', mid);
			if (sheet.getBoundingClientRect().height <= room) lo = mid;
			else hi = mid;
		}
		root.style.setProperty('--fit', lo);
	});
</script>
</body>
</html>`;
}

const browsers = [
	'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium',
];
const browser = process.env.CV_BROWSER ?? browsers.find((b) => existsSync(b));
if (!browser) throw new Error('No encuentro Edge ni Chrome: indica la ruta en CV_BROWSER');

const outDir = join(here, 'out');
mkdirSync(outDir, { recursive: true });
for (const lang of process.argv.slice(2).length ? process.argv.slice(2) : ['es', 'en']) {
	const html = join(outDir, `${lang}.html`);
	writeFileSync(html, page(lang));
	const pdf = join(here, '..', 'public', files[lang]);
	// En los runners de Ubuntu (GitHub Actions) el sandbox de Chrome no arranca
	const ci = process.env.CI ? ['--no-sandbox'] : [];
	execFileSync(browser, [...ci, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000', `--print-to-pdf=${pdf}`, pathToFileURL(html).href], {
		stdio: 'ignore',
	});
	console.log(`${lang}: ${pdf}`);
}
