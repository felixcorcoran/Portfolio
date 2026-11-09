/**
 * Movimiento del portfolio: scroll suave (Lenis) y animaciones ligadas al
 * scroll (GSAP + ScrollTrigger). Con «reducir movimiento» no se carga nada de
 * esto y la página se queda estática y completa (ver portfolio.css).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { createGlobe } from './globe';

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
    gsap.registerPlugin(ScrollTrigger);
    start();
}

// Solo en desarrollo: GSAP a mano desde la consola para depurar
if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger });

function start() {
    // ---------- Scroll suave, sincronizado con ScrollTrigger ----------
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Enlaces internos con el mismo scroll suave
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href')!;
            const target = id === '#top' ? 0 : document.querySelector<HTMLElement>(id);
            if (target === null) return;
            e.preventDefault();
            lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        });
    });

    // ---------- Barra: se esconde al bajar, vuelve al subir ----------
    const nav = document.querySelector<HTMLElement>('[data-nav]');
    lenis.on('scroll', ({ direction, scroll }: { direction: number; scroll: number }) => {
        nav?.classList.toggle('is-hidden', direction === 1 && scroll > innerHeight * 0.6);
    });
    // Sección activa en el menú
    const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.nav-links a')];
    navLinks.forEach((link) => {
        const section = document.querySelector(link.getAttribute('href')!);
        if (!section) return;
        ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => link.classList.toggle('is-active', self.isActive),
        });
    });

    // ---------- Portada: entrada y salida ----------
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, onStart: () => root.classList.add('motion-ready') });
    intro
        // y: 0 anula el translateY(110%) del CSS, que GSAP leería como píxeles
        .fromTo('.hero-name .word', { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.4, stagger: 0.1 })
        .fromTo('.hero [data-intro]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.45);

    // Al bajar, el nombre se encoge y se aleja; el resto sube un poco más rápido
    gsap.to('.hero-name', {
        scale: 0.86, yPercent: -18, opacity: 0.2, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-foot', {
        yPercent: -30, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: '40% top', end: 'bottom top', scrub: true },
    });

    // ---------- Enfoque: las palabras se encienden con el scroll ----------
    // El texto se queda fijo mientras la sección pasa; se enciende entero al
    // 80 % del recorrido, así nunca se va a medias
    const focus = document.querySelector<HTMLElement>('.focus');
    const words = [...document.querySelectorAll<HTMLElement>('.focus-text .fw')];
    if (focus && words.length) {
        ScrollTrigger.create({
            trigger: focus,
            start: 'top 20%',
            end: 'bottom bottom',
            onUpdate: (self) => {
                const lit = Math.ceil(Math.min(self.progress / 0.8, 1) * words.length);
                words.forEach((w, i) => w.classList.toggle('on', i < lit));
            },
        });
        // Al final, el texto se aleja mientras entra la cinta
        gsap.to('.focus-sticky .wrap', {
            scale: 0.94, opacity: 0.3, ease: 'none',
            scrollTrigger: { trigger: '.ribbons', start: 'top bottom', end: 'top 30%', scrub: true },
        });
    }

    // ---------- Entradas genéricas ----------
    // Se reproducen una vez con toggleActions, no con once: un disparador con
    // once se borra solo y, si eso pasa mientras se crea otro (al recargar a
    // media página), ScrollTrigger falla y el resto de animaciones no se monta
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
            y: 40, opacity: 0, duration: 1.1, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        });
    });

    // Titulares: cada línea sube de su máscara
    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((title) => {
        gsap.from(title.querySelectorAll('.line > *'), {
            yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.09,
            scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none none' },
        });
    });

    // ---------- Cinta: las dos filas cruzan en sentidos opuestos ----------
    gsap.utils.toArray<HTMLElement>('.marquee-row').forEach((row) => {
        const dir = Number(row.dataset.dir) || -1;
        gsap.fromTo(row, { xPercent: dir < 0 ? -5 : -30 }, {
            xPercent: dir < 0 ? -30 : -5, ease: 'none',
            scrollTrigger: { trigger: '.ribbons', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
    });

    const mm = gsap.matchMedia();

    // ---------- Proyectos: al llegar la siguiente, la anterior se hunde ----------
    mm.add('(min-width: 761px) and (min-height: 601px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-pcard]');
        const counter = document.querySelector<HTMLElement>('[data-work-current]');
        cards.forEach((card, i) => {
            const inner = card.querySelector('.pcard-inner');
            ScrollTrigger.create({
                trigger: card, start: 'top 60%', end: 'bottom 40%',
                onToggle: (self) => { if (self.isActive && counter) counter.textContent = String(i + 1).padStart(2, '0'); },
            });
            const next = cards[i + 1];
            if (!next || !inner) return;
            // Se oscurece SOLO mientras la siguiente le pasa por encima: empieza
            // cuando el borde de arriba de la siguiente llega al borde de abajo
            // de esta (ya fija) y termina cuando la siguiente se fija. Antes de
            // eso, la tarjeta que se está leyendo se ve entera. Sin transparencia:
            // debajo hay otras tarjetas
            const stickyTop = () => parseFloat(getComputedStyle(card).top) || 0;
            gsap.fromTo(inner, { scale: 1, filter: 'brightness(1)' }, {
                scale: 0.94, filter: 'brightness(0.55)', ease: 'none',
                scrollTrigger: {
                    trigger: next,
                    start: () => `top ${Math.min(stickyTop() + (inner as HTMLElement).offsetHeight, innerHeight)}px`,
                    end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                },
            });
        });
        // La captura se mueve un poco dentro de su marco (paralaje)
        cards.forEach((card) => {
            const img = card.querySelector('.pcard-shot img');
            if (!img) return;
            gsap.fromTo(img, { yPercent: -2, scale: 1.05 }, {
                yPercent: 2, ease: 'none',
                scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        });
    });

    // ---------- Galería: se desliza en horizontal con el scroll (también en
    // móvil). En pantallas bajas no se fija: se desliza con el dedo ----------
    mm.add('(min-height: 601px)', () => {
        const track = document.querySelector<HTMLElement>('[data-track]');
        const pin = document.querySelector<HTMLElement>('.gallery-pin');
        const gallery = document.querySelector<HTMLElement>('.gallery');
        if (!track || !pin || !gallery) return;
        gallery.classList.add('is-pinned');
        const distance = () => Math.max(track.scrollWidth - innerWidth, 0);
        gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: {
                trigger: pin, start: 'top top', end: () => `+=${distance()}`,
                pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
            },
        });
        return () => gallery.classList.remove('is-pinned');
    });

    // ---------- Experiencia ----------
    // Escritorio con altura suficiente: rueda de tarjetas. Si no: línea de tiempo
    const big = '(min-width: 1001px) and (min-height: 601px)';
    const smallOrShort = '(max-width: 1000px), (max-height: 600px)';
    const pad2 = (n: number) => String(n).padStart(2, '0');
    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

    mm.add(smallOrShort, () => {
        // La línea se dibuja con el scroll
        const progress = document.querySelector('[data-exp-progress]');
        if (progress) {
            gsap.fromTo(progress, { scaleY: 0 }, {
                scaleY: 1, ease: 'none',
                scrollTrigger: { trigger: '.exp-list', start: 'top 60%', end: 'bottom 60%', scrub: true },
            });
        }
        // Cada puesto: el periodo pasa de contorno a relleno, el punto se
        // enciende al pasar el 55 % y el contenido sube
        gsap.utils.toArray<HTMLElement>('[data-exp-item]').forEach((job) => {
            const fill = job.querySelector('.exp-f');
            if (fill) {
                gsap.fromTo(fill, { clipPath: 'inset(0 100% 0 0)' }, {
                    clipPath: 'inset(0 0% 0 0)', ease: 'none',
                    scrollTrigger: { trigger: job, start: 'top 85%', end: 'top 40%', scrub: 0.4 },
                });
            }
            ScrollTrigger.create({
                trigger: job, start: 'top 55%',
                onEnter: () => job.classList.add('is-on'),
                onLeaveBack: () => job.classList.remove('is-on'),
            });
            gsap.from(job.querySelectorAll('.exp-place, .exp-main > *'), {
                opacity: 0, y: 24, duration: 0.9, ease: 'expo.out', stagger: 0.07,
                scrollTrigger: { trigger: job, start: 'top 80%', toggleActions: 'play none none none' },
            });
        });
        return () => document.querySelectorAll('[data-exp-item]').forEach((job) => job.classList.remove('is-on'));
    });

    mm.add(big, () => {
        const section = document.querySelector<HTMLElement>('.exp');
        const cards = gsap.utils.toArray<HTMLElement>('[data-exp-item]');
        const counter = document.querySelector<HTMLElement>('[data-exp-n]');
        if (!section || cards.length < 2) return;
        section.classList.add('is-wheel');
        const step = 24;
        // La posición de la rueda sale solo del progreso del scroll: sin estado
        const place = (p: number) => {
            const pos = clamp01((p - 0.06) / 0.88) * (cards.length - 1);
            cards.forEach((card, i) => {
                const d = i - pos;
                const far = Math.abs(d);
                gsap.set(card, { zIndex: 10 - Math.round(far * 2), rotation: d * step, opacity: far <= 1 ? 1 - far * 0.55 : Math.max(0, 0.45 - (far - 1) * 0.9) });
            });
            if (counter) counter.textContent = pad2(Math.round(pos) + 1);
        };
        const proxy = { p: 0 };
        place(0);
        gsap.to(proxy, {
            p: 1, ease: 'none', onUpdate: () => place(proxy.p),
            scrollTrigger: { trigger: '.exp-scroller', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        });
        return () => {
            section.classList.remove('is-wheel');
            gsap.set(cards, { clearProps: 'transform,opacity' });
        };
    });

    // ---------- Stack: el titular se rellena y cada fila se monta ----------
    const stackFill = document.querySelector('[data-stack-fill]');
    if (stackFill) {
        gsap.fromTo(stackFill, { clipPath: 'inset(0 100% 0 0)' }, {
            clipPath: 'inset(0 0% 0 0)', ease: 'none',
            scrollTrigger: { trigger: '.stack-title', start: 'top 85%', end: 'top 30%', scrub: true },
        });
    }
    gsap.utils.toArray<HTMLElement>('[data-skill-row]').forEach((row) => {
        gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' } })
            .from(row.querySelector('.skill-rule'), { scaleX: 0, duration: 1.1, ease: 'expo.inOut' })
            .from(row.querySelector('.skill-num'), { opacity: 0, x: -12, duration: 0.5 }, 0.35)
            .from(row.querySelector('.skill-head h3 .mask > span'), { yPercent: 110, duration: 0.9, ease: 'expo.out' }, 0.4)
            .from(row.querySelector('.skill-head p'), { opacity: 0, y: 16, duration: 0.7, ease: 'power2.out' }, 0.55)
            .from(row.querySelectorAll('.skill-icons li'), {
                opacity: 0, scale: 0.6, y: 10, duration: 0.55, ease: 'back.out(2)', stagger: 0.035,
            }, 0.6);
    });

    // ---------- Stack en círculo (escritorio con altura suficiente) ----------
    mm.add(big, () => {
        const section = document.querySelector<HTMLElement>('.skills');
        const globeCanvas = document.querySelector<HTMLCanvasElement>('[data-globe]');
        const rows = gsap.utils.toArray<HTMLElement>('[data-skill-row]');
        if (!section || !globeCanvas || !rows.length) return;
        section.classList.add('is-ring');
        const n = rows.length;
        const globe = createGlobe(globeCanvas);
        if (import.meta.env.DEV) Object.assign(window, { __globe: globe });
        // Todo sale del progreso: cuánto borde se ilumina y el grupo activo
        // (cuarto del recorrido en el que estás), en la lista y en el globo
        const place = (p: number) => {
            const k = clamp01((p - 0.04) / 0.92);
            const active = Math.min(n - 1, Math.floor(k * n + 0.0001));
            globe.setProgress(k);
            globe.setActive(active);
            rows.forEach((r, i) => r.classList.toggle('is-on', i === active));
        };
        const proxy = { p: 0 };
        place(0);
        gsap.to(proxy, {
            p: 1, ease: 'none', onUpdate: () => place(proxy.p),
            scrollTrigger: { trigger: '.skills-scroller', start: 'top top', end: 'bottom bottom', scrub: 0.5 },
        });
        return () => {
            section.classList.remove('is-ring');
            globe.destroy();
        };
    });

    // ---------- Contacto: el panel crece desde una tarjeta pequeña ----------
    const panel = document.querySelector('[data-contact-panel]');
    if (panel) {
        gsap.fromTo(panel,
            // Empieza como una tarjeta pequeña y crece hasta su tamaño cuando
            // queda centrada en la pantalla. Se escala entera, así el texto
            // nunca queda cortado; el redondeo lo pone el CSS
            { scale: 0.62 },
            {
                scale: 1, ease: 'none',
                scrollTrigger: { trigger: '.contact-panel', start: 'top bottom', end: 'center center', scrub: true },
            });
    }

    // Los disparadores se crean en otro orden que el de la página (los del
    // menú y las entradas, antes que la galería fijada): ScrollTrigger los
    // calcula en orden de creación y los de debajo de la galería no contarían
    // su espacio. sort() los pone en el orden de la página y refresh() los
    // recalcula, también tras montar la rueda y el círculo
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    // Las alturas cambian al cargar fuentes e imágenes: recalcula
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
