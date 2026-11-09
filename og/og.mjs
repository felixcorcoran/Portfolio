/**
 * Genera public/og.png (1200×630), la imagen que sale al compartir el enlace,
 * con el diseño actual del portfolio: nombre en Archivo ancha (CORCORAN en
 * contorno), rol con serif cursiva y el azul de acento. Usa Edge o Chrome sin
 * interfaz, igual que el CV. Uso: npm run og
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const font = (f) => pathToFileURL(require.resolve(f)).href;

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<style>
@font-face { font-family: "Archivo"; src: url("${font('@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')}") format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: "Serif"; src: url("${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')}") format("woff2"); font-style: italic; }
@font-face { font-family: "Mono"; src: url("${font('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}") format("woff2"); font-weight: 100 800; }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; background: #0a0a0b; color: #f1efea; font-family: "Archivo", sans-serif; }
.page { position: relative; width: 100%; height: 100%; padding: 64px 72px; display: flex; flex-direction: column; justify-content: space-between; }
/* Humo azul suave, como el de la portada */
.glow { position: absolute; right: -140px; top: 120px; width: 760px; height: 520px; background: radial-gradient(closest-side, rgba(122,149,255,.28), rgba(60,80,200,.12) 55%, transparent); filter: blur(30px); }
.meta { position: relative; display: flex; align-items: center; gap: 14px; font-family: "Mono"; font-size: 17px; letter-spacing: .16em; text-transform: uppercase; color: #a4a5ad; }
.dot { width: 11px; height: 11px; border-radius: 50%; background: #7a95ff; box-shadow: 0 0 0 6px rgba(122,149,255,.2); }
.name { position: relative; font-weight: 850; font-variation-settings: "wdth" 125; text-transform: uppercase; font-size: 136px; line-height: .84; letter-spacing: -.045em; }
.name span { display: block; }
.name .o { color: transparent; -webkit-text-stroke: 2.5px #f1efea; }
.foot { position: relative; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(241,239,234,.14); padding-top: 26px; }
.role { font-size: 40px; font-weight: 300; letter-spacing: -.02em; color: #a4a5ad; }
.role em { font-family: "Serif"; font-style: italic; font-weight: 400; color: #f1efea; font-size: 1.12em; letter-spacing: 0; }
.url { font-family: "Mono"; font-size: 18px; letter-spacing: .12em; color: #a4a5ad; }
.url b { color: #7a95ff; font-weight: 500; }
</style></head>
<body><div class="page">
  <div class="glow"></div>
  <p class="meta"><span class="dot"></span>Portfolio · Full stack · IA</p>
  <h1 class="name"><span>Felix</span><span class="o">Corcoran</span></h1>
  <div class="foot">
    <p class="role">Desarrollador <em>full stack</em> &amp; integración de <em>IA</em>.</p>
    <p class="url">dev.felixcorcoran<b>.</b>es</p>
  </div>
</div></body></html>`;

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
const file = join(outDir, 'og.html');
writeFileSync(file, html);
const png = join(here, '..', 'public', 'og.png');
execFileSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630', '--virtual-time-budget=4000', `--screenshot=${png}`, pathToFileURL(file).href], { stdio: 'ignore' });
console.log(`og: ${png}`);
