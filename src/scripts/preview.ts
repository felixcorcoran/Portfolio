/**
 * Webs para negocios: al pasar el ratón por una tarjeta, su captura aparece
 * con el cursor en el centro (un círculo con la flecha) y lo sigue con
 * física: un muelle que se pasa un poco y vuelve, y una inclinación según la
 * velocidad. Al cambiar de tarjeta, la tira de capturas se desliza hasta la
 * nueva (barrido) en vez de cambiar de golpe. Solo con ratón; en pantallas
 * táctiles no hace nada (las tarjetas se tocan y abren la web).
 */
const box = document.querySelector<HTMLElement>('.gallery-preview');
const track = document.querySelector<HTMLElement>('[data-preview-track]');
const gallery = document.querySelector<HTMLElement>('.gallery');
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (box && track && gallery && fine) {
    gallery.classList.add('has-preview');
    const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-preview-i]')];
    // Precarga de las capturas, para que el barrido no muestre huecos
    track.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });

    // Posición y velocidad (muelle amortiguado)
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let vx = 0;
    let vy = 0;
    let tx = x;
    let ty = y;
    let scale = 0.6;
    let shown = false;
    let current = -1;
    let raf = 0;

    const STIFF = reduce ? 1 : 0.11; // fuerza del muelle
    const DAMP = reduce ? 0 : 0.74; // cuánto conserva la velocidad (rebote)

    const tick = () => {
        vx = (vx + (tx - x) * STIFF) * DAMP;
        vy = (vy + (ty - y) * STIFF) * DAMP;
        x += vx;
        y += vy;
        scale += ((shown ? 1 : 0.6) - scale) * 0.18;
        // Se inclina hacia donde va, como si tuviera peso
        const rot = Math.max(-14, Math.min(14, vx * 0.55));
        box.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
        const moving = Math.abs(vx) + Math.abs(vy) + Math.abs(tx - x) + Math.abs(ty - y) > 0.2 || Math.abs((shown ? 1 : 0.6) - scale) > 0.01;
        raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const show = (i: number, e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;
        if (!shown) {
            // Aparece donde está el cursor y, si es otra web, ya en su captura
            x = tx;
            y = ty;
            vx = vy = 0;
            if (i !== current) {
                track.classList.add('no-anim');
                track.style.transform = `translateY(${-i * 100}%)`;
                void track.offsetHeight;
                track.classList.remove('no-anim');
            }
        } else if (i !== current) {
            track.style.transform = `translateY(${-i * 100}%)`;
        }
        current = i;
        shown = true;
        box.classList.add('is-on');
        kick();
    };
    const hide = () => {
        shown = false;
        box.classList.remove('is-on');
        kick();
    };

    links.forEach((a) => {
        const i = Number(a.dataset.previewI);
        a.addEventListener('pointerenter', (e) => show(i, e));
        a.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; kick(); });
        a.addEventListener('pointerleave', (e) => {
            // Si pasa directamente a otra tarjeta, no se oculta: hace el barrido
            const to = e.relatedTarget as Element | null;
            if (!to?.closest?.('[data-preview-i]')) hide();
        });
    });
    // Si la galería se mueve con el scroll bajo un cursor quieto
    addEventListener('scroll', () => {
        const over = document.querySelector<HTMLAnchorElement>('[data-preview-i]:hover');
        if (!over) { if (shown) hide(); return; }
        const i = Number(over.dataset.previewI);
        if (i !== current) {
            track.style.transform = `translateY(${-i * 100}%)`;
            current = i;
        }
    }, { passive: true });
}
