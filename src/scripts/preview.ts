/**
 * Webs para negocios: al pasar el ratón por una tarjeta, su captura aparece
 * flotando junto al cursor y lo sigue con suavidad. Solo con ratón; en
 * pantallas táctiles no hace nada (las tarjetas se tocan y abren la web).
 */
const box = document.querySelector<HTMLElement>('.gallery-preview');
const img = document.querySelector<HTMLImageElement>('[data-preview-img]');
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

if (box && img && fine) {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-preview]')];
    // Precarga de las capturas, para que no aparezcan vacías
    links.forEach((a) => { if (a.dataset.preview) new Image().src = a.dataset.preview; });

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    const tick = () => {
        x += (tx - x) * 0.16;
        y += (ty - y) * 0.16;
        box.style.left = `${x}px`;
        box.style.top = `${y}px`;
        raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const follow = (e: PointerEvent) => {
        // A la derecha y algo por encima del cursor
        tx = e.clientX + box.offsetWidth * 0.35;
        ty = e.clientY - box.offsetHeight * 0.35;
        if (!raf) raf = requestAnimationFrame(tick);
    };

    links.forEach((a) => {
        a.addEventListener('pointerenter', (e) => {
            if (!a.dataset.preview) return;
            if (img.getAttribute('src') !== a.dataset.preview) img.src = a.dataset.preview;
            follow(e);
            x = tx;
            y = ty;
            box.style.left = `${x}px`;
            box.style.top = `${y}px`;
            box.classList.add('is-on');
        });
        a.addEventListener('pointermove', follow);
        a.addEventListener('pointerleave', () => box.classList.remove('is-on'));
    });
    // Si la galería se mueve con el scroll bajo un cursor quieto, se oculta
    addEventListener('scroll', () => {
        const over = document.querySelector('[data-preview]:hover');
        if (!over) box.classList.remove('is-on');
    }, { passive: true });
}
