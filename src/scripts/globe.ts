/**
 * Esfera de logos del Stack (canvas 2D, sin librerías 3D). Las tecnologías
 * se reparten sobre una esfera (espiral de Fibonacci), que gira despacio y se
 * puede arrastrar. Los logos del grupo activo se ven a color, más grandes y
 * con su nombre; los demás, apagados. Se para cuando no está en pantalla.
 */
type Item = { n: string; p: string; c: string; g: number };

export function createGlobe(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    let raw: Item[] = [];
    try {
        raw = JSON.parse(canvas.dataset.items ?? '[]');
    } catch {
        raw = [];
    }
    if (!ctx || !raw.length) return { setActive: (_: number) => {}, destroy: () => {} };

    // Grupos intercalados: cada grupo queda repartido por toda la esfera
    const byGroup: Item[][] = [];
    raw.forEach((it) => (byGroup[it.g] ??= []).push(it));
    const items: Item[] = [];
    for (let i = 0; items.length < raw.length; i++) byGroup.forEach((list) => list[i] && items.push(list[i]));

    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = items.map((it, i) => {
        const y = 1 - (i / Math.max(items.length - 1, 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = i * golden;
        return { ...it, x: Math.cos(t) * r, y, z: Math.sin(t) * r, path: it.p ? new Path2D(it.p) : null, glow: 0 };
    });

    const dpr = Math.min(devicePixelRatio || 1, 2);
    let size = 0;
    const resize = () => {
        const s = canvas.clientWidth;
        if (s === size) return;
        size = s;
        canvas.width = Math.round(s * dpr);
        canvas.height = Math.round(s * dpr);
    };

    let active = 0;
    let yaw = 0;
    let pitch = -0.28;
    let vYaw = 0.004;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.setPointerCapture(e.pointerId);
        canvas.classList.add('is-drag');
    };
    const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        vYaw = dx * 0.006;
        yaw += dx * 0.006;
        pitch = Math.max(-1.1, Math.min(1.1, pitch + dy * 0.006));
    };
    const onUp = () => {
        dragging = false;
        canvas.classList.remove('is-drag');
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    const draw = () => {
        resize();
        if (!dragging) {
            // Tras arrastrar, vuelve poco a poco a su giro lento
            vYaw += (0.004 - vYaw) * 0.03;
            yaw += vYaw;
        }
        const w = size;
        const c = w / 2;
        const R = w * 0.38;
        const persp = 2.8;
        const cy = Math.cos(yaw), sy = Math.sin(yaw);
        const cp = Math.cos(pitch), sp = Math.sin(pitch);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, w);

        const projected = points.map((pt) => {
            const x1 = pt.x * cy + pt.z * sy;
            const z1 = -pt.x * sy + pt.z * cy;
            const y2 = pt.y * cp - z1 * sp;
            const z2 = pt.y * sp + z1 * cp;
            const k = persp / (persp - z2);
            pt.glow += ((pt.g === active ? 1 : 0) - pt.glow) * 0.12;
            return { pt, sx: c + x1 * R * k, sy: c + y2 * R * k, z: z2, k };
        }).sort((a, b) => a.z - b.z);

        for (const { pt, sx, sy: py, z, k } of projected) {
            const depth = (z + 1) / 2; // 0 detrás, 1 delante
            const on = pt.glow;
            const chip = (13 + 6 * on) * k;
            ctx.globalAlpha = (0.18 + 0.5 * depth) * (0.45 + 0.55 * on) + 0.25 * on * depth;

            // Ficha redonda
            ctx.beginPath();
            ctx.arc(sx, py, chip, 0, Math.PI * 2);
            ctx.fillStyle = '#15151a';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = on > 0.5 ? pt.c : 'rgba(241,239,234,0.16)';
            ctx.stroke();

            // Logo: a color si es del grupo activo; si no, gris
            const iconSize = chip * 1.05;
            ctx.fillStyle = on > 0.5 ? pt.c : '#6d6e74';
            if (pt.path) {
                ctx.save();
                ctx.translate(sx - iconSize / 2, py - iconSize / 2);
                ctx.scale(iconSize / 24, iconSize / 24);
                ctx.fill(pt.path);
                ctx.restore();
            } else {
                ctx.font = `600 ${Math.round(8 * k)}px "JetBrains Mono Variable", monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(pt.n.slice(0, 4), sx, py);
            }

            // Nombre, solo en los del grupo activo que miran hacia delante
            if (on > 0.5 && z > 0.1) {
                ctx.globalAlpha = Math.min(1, (z - 0.1) * 3) * on;
                ctx.fillStyle = '#f1efea';
                ctx.font = `500 ${Math.round(10.5 * k)}px "JetBrains Mono Variable", monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(pt.n, sx, py + chip + 5);
            }
        }
        ctx.globalAlpha = 1;
    };

    let raf = 0;
    let visible = false;
    const loop = () => {
        draw();
        raf = requestAnimationFrame(loop);
    };
    const run = () => {
        cancelAnimationFrame(raf);
        if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        run();
    });
    io.observe(canvas);
    document.addEventListener('visibilitychange', run);
    draw();

    return {
        setActive(i: number) {
            active = i;
            if (!visible) draw();
        },
        destroy() {
            cancelAnimationFrame(raf);
            io.disconnect();
            document.removeEventListener('visibilitychange', run);
            canvas.removeEventListener('pointerdown', onDown);
            canvas.removeEventListener('pointermove', onMove);
            canvas.removeEventListener('pointerup', onUp);
            canvas.removeEventListener('pointercancel', onUp);
        },
    };
}
