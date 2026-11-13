/**
 * Carruseles a dedo (scroll-snap nativo, sin librerías): pone la posición
 * («02 / 06») y la barra de avance según lo deslizado. Sirve para cualquier
 * lista con [data-carousel] cuya sección tenga su .cnav. El que se desliza es
 * la propia lista o su contenedor (la galería desliza su .gallery-viewport).
 * Cuando la sección se mueve con el scroll (motion.ts), la lista no se
 * desliza y es motion.ts quien actualiza la .cnav.
 */
document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((list) => {
    const section = list.closest('section');
    const counter = section?.querySelector<HTMLElement>('[data-cnav-n]');
    const bar = section?.querySelector<HTMLElement>('.cnav-bar');
    const scroller = list.closest<HTMLElement>('.gallery-viewport') ?? list;
    const items = [...list.children] as HTMLElement[];
    if (!counter || !bar || !items.length) return;

    const update = () => {
        const max = scroller.scrollWidth - scroller.clientWidth;
        if (max <= 0) return;
        const p = scroller.scrollLeft / max;
        // El elemento más cercano al centro de lo visible
        const box = scroller.getBoundingClientRect();
        const mid = box.left + box.width / 2;
        let index = 0;
        let best = Infinity;
        items.forEach((item, i) => {
            const r = item.getBoundingClientRect();
            const d = Math.abs(r.left + r.width / 2 - mid);
            if (d < best) { best = d; index = i; }
        });
        if (p > 0.995) index = items.length - 1;
        counter.textContent = String(index + 1).padStart(2, '0');
        bar.style.setProperty('--p', String((index + 1) / items.length));
    };
    scroller.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
});
