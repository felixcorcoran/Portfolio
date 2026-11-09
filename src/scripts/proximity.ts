/**
 * Letras que reaccionan al ratón (idea de christendijoux.com): en los nombres
 * de la portada y del pie, cada letra adelgaza según lo cerca que pase el
 * cursor, con la fuente variable (eje "wght" de Archivo), y vuelve a su grosor
 * con suavidad. Solo con ratón y sin «reducir movimiento».
 *
 * Marcado: un contenedor con data-prox y, dentro, cada letra en un <span
 * class="ch">. Opcional: data-wdth (ancho fijo del texto, por defecto 125),
 * data-max (grosor en reposo) y data-min (grosor más fino junto al cursor).
 */
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (fine && !reduce) {
    const RADIUS = 240;
    const groups = [...document.querySelectorAll<HTMLElement>('[data-prox]')].map((el) => {
        const chars = [...el.querySelectorAll<HTMLElement>('.ch')];
        const max = Number(el.dataset.max ?? 850);
        return {
            el,
            chars,
            wdth: Number(el.dataset.wdth ?? 125),
            max,
            min: Number(el.dataset.min ?? 250),
            now: chars.map(() => max),
        };
    });

    let x = -9999;
    let y = -9999;
    let raf = 0;
    const visible = new Set<HTMLElement>();

    const frame = () => {
        let moving = false;
        for (const g of groups) {
            if (!visible.has(g.el)) continue;
            g.chars.forEach((ch, i) => {
                const r = ch.getBoundingClientRect();
                const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
                const t = Math.max(0, 1 - d / RADIUS);
                const target = g.max - (g.max - g.min) * t * t * (3 - 2 * t); // smoothstep
                g.now[i] += (target - g.now[i]) * 0.16;
                if (Math.abs(target - g.now[i]) > 0.5) moving = true;
                ch.style.fontVariationSettings = `"wdth" ${g.wdth}, "wght" ${g.now[i].toFixed(0)}`;
            });
        }
        raf = moving ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; if (visible.size) kick(); }, { passive: true });
    document.addEventListener('pointerleave', () => { x = y = -9999; kick(); });
    addEventListener('scroll', () => { if (visible.size) kick(); }, { passive: true });

    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement)));
        if (visible.size) kick();
    });
    groups.forEach((g) => io.observe(g.el));
}
