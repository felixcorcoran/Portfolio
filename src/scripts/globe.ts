/**
 * Globo del Stack (canvas 2D, sin librerías 3D): una esfera oscura con red
 * de paralelos y meridianos, como un globo terráqueo de alambre, y las
 * tecnologías repartidas por su superficie (espiral de Fibonacci). Gira
 * despacio y se puede arrastrar.
 *
 * - setActive(i): las tecnologías del grupo i se ven a color, más grandes y
 *   con su nombre; las demás, apagadas.
 * - setProgress(k): el borde se va iluminando (de 0 a 1) desde arriba, con
 *   un resplandor azul, y la atmósfera gana intensidad.
 *
 * Se para cuando no está en pantalla o la pestaña está oculta.
 */
type Item = { n: string; p: string; c: string; g: number };
type Vec = { x: number; y: number; z: number };

const ACCENT = '122, 149, 255';

export function createGlobe(canvas: HTMLCanvasElement) {
    const noop = { setActive: (_: number) => {}, setProgress: (_: number) => {}, destroy: () => {} };
    const ctx = canvas.getContext('2d');
    let raw: Item[] = [];
    try {
        raw = JSON.parse(canvas.dataset.items ?? '[]');
    } catch {
        raw = [];
    }
    if (!ctx || !raw.length) return noop;

    // Grupos intercalados: cada grupo queda repartido por todo el globo
    const byGroup: Item[][] = [];
    raw.forEach((it) => (byGroup[it.g] ??= []).push(it));
    const items: Item[] = [];
    for (let i = 0; items.length < raw.length; i++) byGroup.forEach((list) => list[i] && items.push(list[i]));

    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = items.map((it, i) => {
        const y = 1 - ((i + 0.5) / items.length) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = i * golden;
        return { ...it, x: Math.cos(t) * r, y, z: Math.sin(t) * r, path: it.p ? new Path2D(it.p) : null, glow: 0 };
    });

    // La red: paralelos cada 30° y meridianos cada 30°, como líneas de puntos 3D
    const SEG = 72;
    const lines: Vec[][] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
        const phi = (lat * Math.PI) / 180;
        const line: Vec[] = [];
        for (let s = 0; s <= SEG; s++) {
            const th = (s / SEG) * Math.PI * 2;
            line.push({ x: Math.cos(phi) * Math.cos(th), y: Math.sin(phi), z: Math.cos(phi) * Math.sin(th) });
        }
        lines.push(line);
    }
    for (let lon = 0; lon < 180; lon += 30) {
        const th = (lon * Math.PI) / 180;
        const line: Vec[] = [];
        for (let s = 0; s <= SEG; s++) {
            const phi = (s / SEG) * Math.PI * 2;
            line.push({ x: Math.cos(phi) * Math.cos(th), y: Math.sin(phi), z: Math.cos(phi) * Math.sin(th) });
        }
        lines.push(line);
    }

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
    let progress = 0;
    let shown = 0; // progreso suavizado del borde
    let yaw = 0.6;
    let pitch = -0.32;
    let vYaw = 0.0035;
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
            vYaw += (0.0035 - vYaw) * 0.03;
            yaw += vYaw;
        }
        shown += (progress - shown) * 0.12;

        const w = size;
        const c = w / 2;
        const R = w * 0.36;
        const persp = 3.2;
        const cy = Math.cos(yaw), sy = Math.sin(yaw);
        const cp = Math.cos(pitch), sp = Math.sin(pitch);
        const project = (v: Vec) => {
            const x1 = v.x * cy + v.z * sy;
            const z1 = -v.x * sy + v.z * cy;
            const y2 = v.y * cp - z1 * sp;
            const z2 = v.y * sp + z1 * cp;
            const k = persp / (persp - z2);
            return { x: c + x1 * R * k, y: c + y2 * R * k, z: z2, k };
        };
        // Radio aparente del borde del globo con esta perspectiva
        const rim = R * (persp / Math.sqrt(persp * persp - 1));

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, w);

        // Atmósfera: halo azul alrededor, más intenso cuanto más avanzas
        const atmo = ctx.createRadialGradient(c, c, rim * 0.92, c, c, rim * 1.32);
        atmo.addColorStop(0, `rgba(${ACCENT}, ${0.1 + 0.18 * shown})`);
        atmo.addColorStop(1, `rgba(${ACCENT}, 0)`);
        ctx.fillStyle = atmo;
        ctx.beginPath();
        ctx.arc(c, c, rim * 1.32, 0, Math.PI * 2);
        ctx.fill();

        // Cuerpo del planeta: oscuro, con la luz arriba a la izquierda
        const body = ctx.createRadialGradient(c - rim * 0.35, c - rim * 0.4, rim * 0.1, c, c, rim);
        body.addColorStop(0, '#191b26');
        body.addColorStop(1, '#0b0b0e');
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(c, c, rim, 0, Math.PI * 2);
        ctx.fill();

        // La red: cada tramo, más claro delante y casi invisible detrás
        ctx.lineWidth = 1;
        for (const line of lines) {
            let prev = project(line[0]);
            for (let s = 1; s < line.length; s++) {
                const cur = project(line[s]);
                const zMid = (prev.z + cur.z) / 2;
                const a = zMid > 0 ? 0.1 + 0.22 * zMid : 0.04 + 0.04 * (1 + zMid);
                ctx.strokeStyle = `rgba(${ACCENT}, ${a})`;
                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(cur.x, cur.y);
                ctx.stroke();
                prev = cur;
            }
        }

        // Borde: un hilo fino siempre y, encima, el tramo iluminado según el
        // progreso, desde arriba en el sentido de las agujas del reloj
        ctx.strokeStyle = `rgba(${ACCENT}, 0.28)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(c, c, rim, 0, Math.PI * 2);
        ctx.stroke();
        if (shown > 0.002) {
            ctx.save();
            ctx.shadowColor = `rgba(${ACCENT}, 0.9)`;
            ctx.shadowBlur = 18;
            ctx.strokeStyle = `rgba(${ACCENT}, 1)`;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(c, c, rim, -Math.PI / 2, -Math.PI / 2 + shown * Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Las tecnologías, de atrás adelante
        const projected = points.map((pt) => {
            pt.glow += ((pt.g === active ? 1 : 0) - pt.glow) * 0.12;
            return { pt, ...project(pt) };
        }).sort((a, b) => a.z - b.z);

        for (const { pt, x, y, z, k } of projected) {
            const depth = (z + 1) / 2; // 0 detrás, 1 delante
            const on = pt.glow;
            const chip = (12 + 6 * on) * k;
            ctx.globalAlpha = (0.15 + 0.55 * depth) * (0.45 + 0.55 * on) + 0.25 * on * depth;

            ctx.beginPath();
            ctx.arc(x, y, chip, 0, Math.PI * 2);
            ctx.fillStyle = '#15151a';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = on > 0.5 ? pt.c : 'rgba(241,239,234,0.16)';
            ctx.stroke();

            const iconSize = chip * 1.05;
            ctx.fillStyle = on > 0.5 ? pt.c : '#6d6e74';
            if (pt.path) {
                ctx.save();
                ctx.translate(x - iconSize / 2, y - iconSize / 2);
                ctx.scale(iconSize / 24, iconSize / 24);
                ctx.fill(pt.path);
                ctx.restore();
            } else {
                ctx.font = `600 ${Math.round(8 * k)}px "JetBrains Mono Variable", monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(pt.n.slice(0, 4), x, y);
            }

            // Nombre, solo en los del grupo activo que miran hacia delante
            if (on > 0.5 && z > 0.1) {
                ctx.globalAlpha = Math.min(1, (z - 0.1) * 3) * on;
                ctx.fillStyle = '#f1efea';
                ctx.font = `500 ${Math.round(10.5 * k)}px "JetBrains Mono Variable", monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(pt.n, x, y + chip + 5);
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
        setProgress(k: number) {
            progress = Math.min(Math.max(k, 0), 1);
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
