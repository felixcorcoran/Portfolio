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

    // ---------- Proyectos: tarjetas que se apilan (escritorio) ----------
    // Cada tarjeta llega inclinada hacia atrás y se endereza al fijarse, con un
    // brillo que la cruza; su captura se descubre y se acerca, y su texto entra
    // escalonado. Cuando la siguiente le pasa por encima, se hunde y se apaga.
    // El contador gira como un marcador. Todo va ligado al scroll
    mm.add('(min-width: 761px) and (min-height: 601px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-pcard]');
        const counter = document.querySelector<HTMLElement>('[data-work-current]');
        const stickyTopOf = (el: HTMLElement) => parseFloat(getComputedStyle(el).top) || 0;

        // Contador «01 / 06»: el número sale por arriba y entra el nuevo por abajo
        let shownIndex = 0;
        let roll: gsap.core.Timeline | null = null;
        const setIndex = (i: number) => {
            if (!counter || i === shownIndex) return;
            const dir = i > shownIndex ? 1 : -1;
            shownIndex = i;
            roll?.kill();
            roll = gsap.timeline()
                .to(counter, { yPercent: -100 * dir, opacity: 0, duration: 0.18, ease: 'power2.in' })
                .add(() => { counter.textContent = String(i + 1).padStart(2, '0'); })
                .fromTo(counter, { yPercent: 100 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' });
        };

        cards.forEach((card, i) => {
            const inner = card.querySelector<HTMLElement>('.pcard-inner');
            const shot = card.querySelector<HTMLElement>('.pcard-shot');
            const sheen = card.querySelector<HTMLElement>('.pcard-sheen');
            const body = card.querySelectorAll('.pcard-body > *');
            if (!inner) return;

            // Índice del contador: sin estado guardado, sale de qué tarjetas han pasado
            ScrollTrigger.create({
                trigger: card, start: 'top 60%',
                onEnter: () => setIndex(i),
                onLeaveBack: () => setIndex(Math.max(i - 1, 0)),
            });

            // Llegada: de inclinada y algo más baja a recta, mientras sube hasta fijarse
            const arrive = {
                trigger: card, start: 'top bottom',
                end: () => `top ${stickyTopOf(card) + 24}px`,
                scrub: 0.7, invalidateOnRefresh: true,
            };
            gsap.fromTo(inner, { rotationX: 9, y: 70, transformPerspective: 1600, transformOrigin: '50% 0%' }, {
                rotationX: 0, y: 0, ease: 'power2.out', scrollTrigger: arrive,
            });
            if (sheen) {
                gsap.fromTo(sheen, { backgroundPosition: '120% 0' }, { backgroundPosition: '-20% 0', ease: 'none', scrollTrigger: arrive });
            }
            // La captura llega pequeña, inclinada y algo baja, y se asienta. Se
            // mueve el marco entero: la imagen nunca se recorta ni se acerca
            if (shot) {
                gsap.fromTo(shot, { scale: 0.82, y: 50, rotationX: 14, opacity: 0.35, transformPerspective: 1200, transformOrigin: '50% 100%' }, {
                    scale: 1, y: 0, rotationX: 0, opacity: 1, ease: 'power2.out', scrollTrigger: arrive,
                });
            }
            // Texto: entra escalonado cuando la tarjeta ya se lee; se recoge al volver
            gsap.from(body, {
                y: 28, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06,
                scrollTrigger: { trigger: card, start: 'top 55%', toggleActions: 'play none none reverse' },
            });

            // Salida: se hunde y se apaga SOLO mientras la siguiente le pasa por encima
            const next = cards[i + 1];
            if (!next) return;
            gsap.fromTo(inner, { scale: 1, filter: 'brightness(1)' }, {
                scale: 0.92, filter: 'brightness(0.45)', ease: 'power1.in',
                scrollTrigger: {
                    trigger: next,
                    start: () => `top ${Math.min(stickyTopOf(card) + inner.offsetHeight, innerHeight)}px`,
                    end: () => `top ${stickyTopOf(next)}px`,
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                },
            });
        });
        return () => {
            roll?.kill();
            if (counter) { counter.textContent = '01'; gsap.set(counter, { clearProps: 'all' }); }
        };
    });

    // ---------- Proyectos en móvil: raíl horizontal ligado al scroll ----------
    // El bloque se fija en el centro de la pantalla y las tarjetas pasan de
    // derecha a izquierda al bajar. La del centro se ve recta y encendida; las
    // de los lados, giradas, más pequeñas y apagadas, y su captura se desplaza
    // dentro del marco (paralaje). La posición y la barra siguen al scroll
    mm.add('(max-width: 760px) and (min-height: 601px)', () => {
        const work = document.querySelector<HTMLElement>('.work');
        const pin = document.querySelector<HTMLElement>('.pcards-pin');
        const list = document.querySelector<HTMLElement>('.pcards');
        const counter = work?.querySelector<HTMLElement>('[data-cnav-n]');
        const bar = work?.querySelector<HTMLElement>('.cnav-bar');
        const cards = gsap.utils.toArray<HTMLElement>('[data-pcard]');
        if (!work || !pin || !list || !cards.length) return;
        work.classList.add('is-rail');
        list.scrollLeft = 0;

        const last = cards[cards.length - 1];
        // Hasta que la última tarjeta queda centrada
        const distance = () => Math.max(last.offsetLeft + last.offsetWidth / 2 - list.clientWidth / 2, 0);
        const rail = gsap.to(cards, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: {
                trigger: pin, start: 'center center', end: () => `+=${distance() * 1.15}`,
                pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
                // Al soltar, se queda con una tarjeta centrada
                snap: { snapTo: 1 / (cards.length - 1), duration: { min: 0.2, max: 0.5 }, delay: 0.08, ease: 'power2.inOut' },
                onUpdate: (self) => {
                    const i = Math.round(self.progress * (cards.length - 1));
                    if (counter) counter.textContent = String(i + 1).padStart(2, '0');
                    bar?.style.setProperty('--p', String((i + 1) / cards.length));
                },
            },
        });

        cards.forEach((card) => {
            const inner = card.querySelector<HTMLElement>('.pcard-inner');
            const shot = card.querySelector<HTMLElement>('.pcard-shot');
            if (!inner) return;
            // Al entrar por la derecha: girada y pequeña → recta en el centro
            const enter = { trigger: card, containerAnimation: rail, start: 'left right', end: 'center center', scrub: true };
            // Al salir por la izquierda: se gira hacia el otro lado y se apaga
            const leave = { trigger: card, containerAnimation: rail, start: 'center center', end: 'right left', scrub: true };
            gsap.fromTo(inner, { rotationY: -22, scale: 0.86, filter: 'brightness(0.5)' }, {
                rotationY: 0, scale: 1, filter: 'brightness(1)', ease: 'power1.out', immediateRender: card !== cards[0], scrollTrigger: enter,
            });
            gsap.fromTo(inner, { rotationY: 0, scale: 1, filter: 'brightness(1)' }, {
                rotationY: 22, scale: 0.86, filter: 'brightness(0.5)', ease: 'power1.in', immediateRender: false, scrollTrigger: leave,
            });
            // Paralaje: el marco de la captura entero se desliza un poco dentro de
            // su hueco (cabe en el margen), sin acercar ni recortar la imagen
            if (shot) {
                gsap.fromTo(shot, { xPercent: 5 }, {
                    xPercent: -5, ease: 'none',
                    scrollTrigger: { trigger: card, containerAnimation: rail, start: 'left right', end: 'right left', scrub: true },
                });
            }
        });

        return () => {
            work.classList.remove('is-rail');
            if (counter) counter.textContent = '01';
            bar?.style.removeProperty('--p');
        };
    });

    // ---------- Galería: se desliza en horizontal con el scroll (escritorio).
    // En móvil y en pantallas bajas no se fija: se desliza con el dedo ----------
    mm.add('(min-width: 761px) and (min-height: 601px)', () => {
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

    const big = '(min-width: 1001px) and (min-height: 601px)';
    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

    // ---------- Experiencia ----------
    // La línea se dibuja hasta el marcador (fijo a media pantalla) y se enciende
    // el último hito cuya parte de arriba ha pasado el marcador. Sin estado: se
    // calcula en cada actualización, así que al volver arriba o recargar a media
    // página queda bien.
    const progress = document.querySelector('[data-exp-progress]');
    const expList = document.querySelector<HTMLElement>('.exp-list');
    if (progress && expList) {
        gsap.fromTo(progress, { scaleY: 0 }, {
            scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: '.exp-track', start: 'top 50%', end: 'bottom 50%', scrub: true },
        });
        const jobs = gsap.utils.toArray<HTMLElement>('[data-exp-item]');
        const now = document.querySelector<HTMLElement>('[data-exp-now]');
        let active = -1;
        const light = () => {
            const mid = innerHeight * 0.5;
            // -1: ninguno ha llegado aún al marcador y todos siguen apagados
            let i = -1;
            jobs.forEach((job, k) => { if (job.getBoundingClientRect().top < mid) i = k; });
            if (i === active) return;
            const dir = i > active ? 1 : -1;
            active = i;
            jobs.forEach((job, k) => job.classList.toggle('is-on', k === i));
            if (now) {
                now.textContent = String(Math.max(i, 0) + 1).padStart(2, '0');
                gsap.fromTo(now, { yPercent: 100 * dir }, { yPercent: 0, duration: 0.5, ease: 'expo.out', overwrite: true });
            }
        };
        ScrollTrigger.create({ trigger: '.exp', start: 'top bottom', end: 'bottom top', onUpdate: light, onRefresh: light });
        light();

        // El título se enciende letra a letra al entrar, ligado al scroll, y
        // después el rótulo, el contador y el marcador
        const head = document.querySelector('.exp-head');
        gsap.timeline({ scrollTrigger: { trigger: '.exp', start: 'top 80%', end: 'top 15%', scrub: 0.6 } })
            .to('[data-exp-title] .ch', { opacity: 1, stagger: 0.08, duration: 0.3, ease: 'none' })
            .from(head?.querySelectorAll('.label, .exp-count') ?? [], { opacity: 0, y: 12, duration: 0.4, stagger: 0.1 }, '-=0.3');
        gsap.from('.exp-mark', {
            scale: 0, duration: 0.9, ease: 'back.out(2)',
            scrollTrigger: { trigger: '.exp-track', start: 'top 55%', toggleActions: 'play none none reverse' },
        });
    }

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
