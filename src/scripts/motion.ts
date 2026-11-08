/**
 * Movimiento del portfolio: scroll suave (Lenis) y animaciones ligadas al
 * scroll (GSAP + ScrollTrigger). Con «reducir movimiento» no se carga nada de
 * esto y la página se queda estática y completa (ver portfolio.css).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

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
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
            y: 40, opacity: 0, duration: 1.1, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
    });

    // Titulares: cada línea sube de su máscara
    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((title) => {
        gsap.from(title.querySelectorAll('.line > *'), {
            yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.09,
            scrollTrigger: { trigger: title, start: 'top 85%', once: true },
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
    mm.add('(min-width: 761px)', () => {
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
            // Se oscurece (no transparenta: debajo hay otras tarjetas)
            gsap.to(inner, {
                // Gradual: empieza suave cuando asoma la siguiente (power2.in apenas
                // la toca al principio) y nunca llega a negro; el scrub con
                // retardo suaviza los tirones de la rueda
                scale: 0.94, filter: 'brightness(0.55)', ease: 'power2.in',
                scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 12%', scrub: 0.6 },
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

    // ---------- Galería: en escritorio se desliza en horizontal con el scroll ----------
    mm.add('(min-width: 761px)', () => {
        const track = document.querySelector<HTMLElement>('[data-track]');
        const pin = document.querySelector<HTMLElement>('.gallery-pin');
        if (!track || !pin) return;
        const distance = () => Math.max(track.scrollWidth - innerWidth, 0);
        gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: {
                trigger: pin, start: 'top top', end: () => `+=${distance()}`,
                pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
            },
        });
    });

    // ---------- Experiencia: la línea se dibuja con el scroll ----------
    const progress = document.querySelector('[data-exp-progress]');
    if (progress) {
        gsap.fromTo(progress, { scaleY: 0 }, {
            scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: '.exp-list', start: 'top 70%', end: 'bottom 60%', scrub: true },
        });
    }

    // ---------- Contacto: el panel se abre hasta llenar la pantalla ----------
    const panel = document.querySelector('[data-contact-panel]');
    if (panel) {
        gsap.fromTo(panel,
            // Empieza como una tarjeta pequeña y llena la pantalla justo cuando
            // el panel llega arriba (el titular ya está centrado)
            // (se escala entero, así el texto nunca queda cortado)
            { scale: 0.62, borderRadius: '3rem' },
            {
                scale: 1, borderRadius: '0rem', ease: 'none',
                scrollTrigger: { trigger: '.contact-panel', start: 'top bottom', end: 'top top', scrub: true },
            });
    }

    // Las alturas cambian al cargar fuentes e imágenes: recalcula
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
