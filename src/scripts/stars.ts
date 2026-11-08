/**
 * Cielo del pie: puntos que parpadean detrás del arco azul (canvas 2D).
 * Solo se anima mientras el pie está en pantalla; con «reducir movimiento»
 * se pinta una vez, quieto.
 */
const canvas = document.querySelector<HTMLCanvasElement>('[data-stars]');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    type Star = { x: number; y: number; r: number; a: number; speed: number; phase: number; blue: boolean };
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);

    // Siempre las mismas estrellas: un generador con semilla fija
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    const build = () => {
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed = 7;
        const count = Math.round((w * h) / 2600);
        stars = Array.from({ length: count }, () => ({
            x: rand() * w,
            y: rand() * h,
            r: 0.35 + rand() * rand() * 1.1,
            a: 0.25 + rand() * 0.65,
            speed: 0.6 + rand() * 1.6,
            phase: rand() * Math.PI * 2,
            blue: rand() < 0.12,
        }));
    };

    const draw = (t: number) => {
        ctx.clearRect(0, 0, w, h);
        for (const s of stars) {
            const twinkle = reduce ? 1 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
            ctx.globalAlpha = s.a * twinkle;
            ctx.fillStyle = s.blue ? '#9fb4ff' : '#f1efea';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    };

    build();
    draw(0);
    addEventListener('resize', () => { build(); draw(performance.now() / 1000); });

    if (!reduce) {
        let raf = 0;
        let visible = false;
        const loop = (now: number) => {
            draw(now / 1000);
            raf = requestAnimationFrame(loop);
        };
        const run = () => {
            cancelAnimationFrame(raf);
            if (visible && !document.hidden) raf = requestAnimationFrame(loop);
        };
        new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; run(); }).observe(canvas);
        document.addEventListener('visibilitychange', run);
    }
}
