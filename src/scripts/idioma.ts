/**
 * Cambio de idioma sin perder el sitio. Al pulsar ES/EN se apunta en qué
 * sección se está leyendo y por dónde va (en proporción, porque el texto en
 * inglés no mide lo mismo); al cargar el otro idioma, la página aparece ya en
 * ese mismo punto. Mientras se coloca, el <head> la tiene oculta (clase
 * lang-arriving) para que no se vea el salto.
 */
const KEY = 'lang-pos';
const root = document.documentElement;
const probe = () => innerHeight * 0.3;
const sections = () => [...document.querySelectorAll<HTMLElement>('main > section[id]')];

// Al salir: qué sección hay a un 30 % de la pantalla y cuánto se ha leído de ella
document.querySelectorAll<HTMLAnchorElement>('.nav-lang a:not([aria-current])').forEach((link) => {
    link.addEventListener('click', () => {
        const y = scrollY + probe();
        let current: HTMLElement | undefined;
        for (const s of sections()) if (s.getBoundingClientRect().top + scrollY <= y) current = s;
        if (!current) return;
        const top = current.getBoundingClientRect().top + scrollY;
        const share = (y - top) / Math.max(current.offsetHeight, 1);
        try { sessionStorage.setItem(KEY, JSON.stringify({ id: current.id, share })); } catch {}
    });
});

// Al llegar: se coloca en ese punto cuando ya están las alturas definitivas
let saved: { id: string; share: number } | null = null;
try {
    saved = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    sessionStorage.removeItem(KEY);
} catch {}

const reveal = () => root.classList.remove('lang-arriving');
if (saved) {
    history.scrollRestoration = 'manual';
    const place = () => {
        const target = document.getElementById(saved!.id);
        if (target) {
            const top = target.getBoundingClientRect().top + scrollY;
            window.scrollTo({ top: Math.max(0, top + saved!.share * target.offsetHeight - probe()), behavior: 'instant' });
        }
        requestAnimationFrame(reveal);
    };
    // Tras cargar imágenes y fuentes (y que las animaciones fijen sus secciones)
    if (document.readyState === 'complete') setTimeout(place, 150);
    else addEventListener('load', () => setTimeout(place, 150), { once: true });
    // Pase lo que pase, la página no se queda oculta
    setTimeout(reveal, 2500);
} else {
    reveal();
}
