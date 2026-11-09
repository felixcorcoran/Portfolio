/**
 * Carrusel de proyectos en móvil (scroll-snap nativo, sin librerías): pone
 * la posición («02 / 06») y la barra de avance según lo deslizado.
 */
const list = document.querySelector<HTMLElement>('.pcards');
const counter = document.querySelector<HTMLElement>('[data-pc-n]');
const bar = document.querySelector<HTMLElement>('[data-pc-bar]');

if (list && counter && bar) {
    const cards = [...list.querySelectorAll<HTMLElement>('.pcard')];
    const update = () => {
        const max = list.scrollWidth - list.clientWidth;
        if (max <= 0 || !cards.length) return;
        const p = list.scrollLeft / max;
        // La tarjeta más cercana al borde izquierdo
        const left = list.getBoundingClientRect().left;
        let index = 0;
        let best = Infinity;
        cards.forEach((card, i) => {
            const d = Math.abs(card.getBoundingClientRect().left - left);
            if (d < best) { best = d; index = i; }
        });
        counter.textContent = String(index + 1).padStart(2, '0');
        bar.parentElement?.style.setProperty('--p', String(Math.max((index + 1) / cards.length, p)));
    };
    list.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
}
