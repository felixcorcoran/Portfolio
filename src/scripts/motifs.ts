/**
 * Webs para negocios: una animación de alambre distinta en cada tarjeta, que
 * alude al sector del negocio (obra, peluquería, reformas, citas, estética).
 * Todas con el mismo lenguaje que el resto de la web: solo el azul de acento,
 * líneas finas y puntos. En reposo van lentas y tenues; con el ratón encima se
 * aceleran y brillan (y la vista previa de la web sigue saliendo, preview.ts).
 *
 * Marcado: <canvas data-motif="tower|waves|plan|calendar|flower|hall"> dentro
 * de la tarjeta (el <a>). Solo se animan las que están en pantalla; con
 * «reducir movimiento» se pintan una vez, quietas.
 */
type Draw = (c: CanvasRenderingContext2D, w: number, h: number, t: number, k: number) => void;

const A = (a: number) => `rgba(122, 149, 255, ${Math.max(0, Math.min(1, a)).toFixed(3)})`;
const TAU = Math.PI * 2;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

// Proyección isométrica centrada en (cx, cy) con unidad u
const iso = (cx: number, cy: number, u: number) => (x: number, y: number, z: number): [number, number] => [
    cx + (x - y) * 0.866 * u,
    cy + (x + y) * 0.5 * u - z * u,
];
const line = (c: CanvasRenderingContext2D, a: [number, number], b: [number, number], p = 1) => {
    if (p <= 0) return;
    c.beginPath();
    c.moveTo(a[0], a[1]);
    c.lineTo(a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p);
    c.stroke();
};
const dot = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    c.beginPath();
    c.arc(x, y, r, 0, TAU);
    c.fill();
};
// Rejilla de puntos en el suelo isométrico
const floorDots = (c: CanvasRenderingContext2D, P: ReturnType<typeof iso>, n: number, k: number) => {
    c.fillStyle = A(0.22 * k);
    for (let x = -n; x <= n; x++) for (let y = -n; y <= n; y++) {
        const [px, py] = P(x, y, 0);
        dot(c, px, py, 0.9);
    }
};

const motifs: Record<string, Draw> = {
    // Obra: una torre que se levanta planta a planta y vuelve a empezar
    tower(c, w, h, t, k) {
        const u = Math.min(w, h) / 11;
        const P = iso(w * 0.5, h * 0.7, u);
        floorDots(c, P, 4, k);
        const floors = 5;
        const cycle = (t * 0.12) % 1.25; // un rato de pausa con la torre entera
        const built = clamp01(cycle / 1) * floors;
        const s = 1.4;
        for (let f = 0; f < floors; f++) {
            const p = clamp01(built - f);
            if (p <= 0) break;
            const z0 = f * 1.05;
            const z1 = z0 + 1.05 * p;
            const top = f === floors - 1 && p >= 1;
            c.strokeStyle = A((0.35 + 0.4 * (f + 1) / floors) * k);
            c.lineWidth = 1;
            const corners: [number, number][] = [[-s, -s], [s, -s], [s, s], [-s, s]];
            corners.forEach(([x, y]) => line(c, P(x, y, z0), P(x, y, z1)));
            for (let i = 0; i < 4; i++) {
                const [x0, y0] = corners[i];
                const [x1, y1] = corners[(i + 1) % 4];
                line(c, P(x0, y0, z1), P(x1, y1, z1), p);
                // Ventanas: dos puntos por fachada visible
                if (p >= 1 && (i === 1 || i === 2)) {
                    c.fillStyle = A(0.55 * k);
                    for (const m of [0.33, 0.66]) {
                        const [px, py] = P(x0 + (x1 - x0) * m, y0 + (y1 - y0) * m, z0 + 0.5);
                        dot(c, px, py, 1.3);
                    }
                }
            }
            if (top) {
                // Grúa en lo alto
                c.strokeStyle = A(0.7 * k);
                line(c, P(s, -s, z1), P(s, -s, z1 + 1.6));
                line(c, P(s, -s, z1 + 1.6), P(-s - 1.2, -s, z1 + 1.6));
                const sw = Math.sin(t * 1.5) * 0.3;
                line(c, P(-s - 0.4 + sw, -s, z1 + 1.6), P(-s - 0.4 + sw, -s, z1 + 0.6));
            }
        }
    },

    // Nave: estructura baja con cubierta a dos aguas y un punto que recorre sus aristas
    hall(c, w, h, t, k) {
        const u = Math.min(w, h) / 12;
        const P = iso(w * 0.5, h * 0.6, u);
        floorDots(c, P, 5, k);
        const X = 2.8, Y = 1.8, Z = 1.4, R = 2.4;
        c.lineWidth = 1;
        // Pórticos a lo largo de la nave
        const n = 5;
        for (let i = 0; i < n; i++) {
            const x = -X + (2 * X * i) / (n - 1);
            const frame: [number, number, number][] = [[x, -Y, 0], [x, -Y, Z], [x, 0, R], [x, Y, Z], [x, Y, 0]];
            c.strokeStyle = A((0.25 + 0.35 * (i / (n - 1))) * k);
            for (let j = 0; j < frame.length - 1; j++) line(c, P(...frame[j]), P(...frame[j + 1]));
        }
        // Largueros
        c.strokeStyle = A(0.4 * k);
        for (const [y, z] of [[-Y, Z], [0, R], [Y, Z], [-Y, 0], [Y, 0]] as [number, number][]) line(c, P(-X, y, z), P(X, y, z));
        // Punto que recorre el perfil de la cubierta de un extremo a otro
        const q = (t * 0.18) % 1;
        const along = -X + 2 * X * q;
        const prof: [number, number][] = [[-Y, Z], [0, R], [Y, Z]];
        const seg = (t * 0.9) % 2;
        const i0 = Math.floor(seg);
        const f = seg - i0;
        const a = prof[i0], b = prof[i0 + 1];
        const [px, py] = P(along, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
        c.fillStyle = A(0.25 * k);
        dot(c, px, py, 7);
        c.fillStyle = A(1 * k);
        dot(c, px, py, 2.2);
    },

    // Peluquería: mechones de líneas que se mecen
    waves(c, w, h, t, k) {
        const n = 14;
        c.lineWidth = 1;
        for (let i = 0; i < n; i++) {
            const f = i / (n - 1);
            const x0 = w * (0.12 + f * 0.5);
            const amp = w * (0.08 + 0.05 * Math.sin(f * 3));
            c.strokeStyle = A((0.18 + 0.5 * Math.sin(f * Math.PI)) * k);
            c.beginPath();
            const steps = 40;
            for (let s = 0; s <= steps; s++) {
                const p = s / steps;
                const y = h * (0.04 + p * 0.92);
                const x = x0 + p * w * 0.28 + Math.sin(p * 3.2 + t * 0.9 + f * 1.4) * amp * p;
                if (s === 0) c.moveTo(x, y); else c.lineTo(x, y);
            }
            c.stroke();
            // Punta del mechón
            const y = h * 0.96;
            const x = x0 + w * 0.28 + Math.sin(3.2 + t * 0.9 + f * 1.4) * amp;
            c.fillStyle = A(0.6 * k);
            dot(c, x, y, 1.4);
        }
    },

    // Reformas: la planta de una vivienda con un punto que la recorre
    plan(c, w, h, t, k) {
        const s = Math.min(w / 15, h / 11);
        const ox = w * 0.5 - 4.5 * s, oy = h * 0.54 - 3.1 * s;
        const X = (v: number) => ox + v * s, Y = (v: number) => oy + v * s;
        c.lineWidth = 1;
        // Muros (exterior más marcado)
        c.strokeStyle = A(0.65 * k);
        c.strokeRect(X(0), Y(0), 9 * s, 6.2 * s);
        c.strokeStyle = A(0.38 * k);
        const walls: [number, number, number, number][] = [
            [4, 0, 4, 2.2], [4, 3.2, 4, 6.2], [0, 3.4, 2.6, 3.4], [4, 3.4, 9, 3.4], [6.6, 0, 6.6, 1.6], [6.6, 2.4, 6.6, 3.4],
        ];
        walls.forEach(([a, b, cc, d]) => line(c, [X(a), Y(b)], [X(cc), Y(d)]));
        // Puertas: arcos
        c.strokeStyle = A(0.3 * k);
        c.beginPath(); c.arc(X(4), Y(2.2), s, Math.PI / 2, Math.PI); c.stroke();
        c.beginPath(); c.arc(X(2.6), Y(3.4), s * 0.8, 0, Math.PI / 2); c.stroke();
        // Cota arriba
        c.strokeStyle = A(0.25 * k);
        line(c, [X(0), Y(-0.6)], [X(9), Y(-0.6)]);
        line(c, [X(0), Y(-0.85)], [X(0), Y(-0.35)]);
        line(c, [X(9), Y(-0.85)], [X(9), Y(-0.35)]);
        // Recorrido por las habitaciones
        const path: [number, number][] = [[2, 1.6], [4, 2.7], [5.3, 1.8], [6.6, 2], [7.8, 1.6], [7.8, 4.8], [5.5, 4.8], [3.3, 3.9], [1.3, 4.8], [1.4, 1.6]];
        const L = path.length;
        const q = (t * 0.35) % L;
        const i = Math.floor(q), f = q - i;
        const a = path[i], b = path[(i + 1) % L];
        const ease = f * f * (3 - 2 * f);
        const px = X(a[0] + (b[0] - a[0]) * ease), py = Y(a[1] + (b[1] - a[1]) * ease);
        // Habitación activa iluminada
        c.fillStyle = A(0.06 * k);
        const rooms: [number, number, number, number][] = [[0, 0, 4, 3.4], [4, 0, 2.6, 3.4], [6.6, 0, 2.4, 3.4], [4, 3.4, 5, 2.8], [0, 3.4, 4, 2.8]];
        const r = rooms.find(([x, y, ww, hh]) => a[0] + (b[0] - a[0]) * ease >= x && a[0] + (b[0] - a[0]) * ease <= x + ww && a[1] + (b[1] - a[1]) * ease >= y && a[1] + (b[1] - a[1]) * ease <= y + hh);
        if (r) c.fillRect(X(r[0]), Y(r[1]), r[2] * s, r[3] * s);
        c.fillStyle = A(0.22 * k);
        dot(c, px, py, 8);
        c.fillStyle = A(1 * k);
        dot(c, px, py, 2.4);
    },

    // Secretaría: un calendario de puntos donde se van reservando citas
    calendar(c, w, h, t, k) {
        const cols = 7, rows = 5;
        const g = Math.min(w / (cols + 3), h / (rows + 3));
        const ox = w * 0.5 - ((cols - 1) * g) / 2, oy = h * 0.54 - ((rows - 1) * g) / 2;
        // Cabecera de días
        c.strokeStyle = A(0.3 * k);
        c.lineWidth = 1;
        line(c, [ox - g * 0.5, oy - g * 0.75], [ox + (cols - 0.5) * g, oy - g * 0.75]);
        const step = Math.floor(t * 0.9);
        for (let r = 0; r < rows; r++) for (let cl = 0; cl < cols; cl++) {
            const x = ox + cl * g, y = oy + r * g;
            const id = r * cols + cl;
            // Cada celda se «reserva» un rato según una secuencia fija
            const hash = (id * 37 + 11) % 23;
            const age = (step - hash + 230) % 23;
            const on = age < 6;
            if (on) {
                const fresh = age === 0 ? (t * 0.9) % 1 : 1;
                c.strokeStyle = A(0.75 * k * (1 - age / 7));
                c.beginPath(); c.arc(x, y, g * 0.3 * (0.6 + 0.4 * fresh), 0, TAU); c.stroke();
                c.fillStyle = A(0.9 * k * (1 - age / 7));
                dot(c, x, y, 2.2);
            } else {
                c.fillStyle = A(0.25 * k);
                dot(c, x, y, 1.1);
            }
        }
        // Hoy: un aro que late
        const tx = ox + 3 * g, ty = oy + 2 * g;
        const pulse = (t * 0.8) % 1;
        c.strokeStyle = A(0.6 * k * (1 - pulse));
        c.beginPath(); c.arc(tx, ty, g * (0.3 + pulse * 0.35), 0, TAU); c.stroke();
    },

    // Estética: una flor de nodos que gira y respira
    flower(c, w, h, t, k) {
        const cx = w * 0.5, cy = h * 0.46;
        const R = Math.min(w, h) * 0.32;
        const petals = 6;
        const rings = 3;
        c.lineWidth = 1;
        const breathe = 1 + Math.sin(t * 0.8) * 0.05;
        for (let ring = 0; ring < rings; ring++) {
            const n = 36;
            const rot = t * 0.12 * (ring % 2 ? -1 : 1) + ring * 0.3;
            const pts: [number, number][] = [];
            for (let i = 0; i < n; i++) {
                const th = (i / n) * TAU;
                const rr = R * breathe * (0.45 + ring * 0.22) * (0.65 + 0.35 * Math.abs(Math.cos((petals / 2) * th)));
                pts.push([cx + Math.cos(th + rot) * rr, cy + Math.sin(th + rot) * rr]);
            }
            c.strokeStyle = A((0.22 + ring * 0.12) * k);
            c.beginPath();
            pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
            c.closePath();
            c.stroke();
            c.fillStyle = A((0.35 + ring * 0.2) * k);
            pts.forEach(([x, y], i) => { if (i % 3 === 0) dot(c, x, y, 1.3); });
            // Radios al centro desde las puntas de los pétalos
            if (ring === rings - 1) {
                c.strokeStyle = A(0.12 * k);
                pts.forEach(([x, y], i) => { if (i % 6 === 0) line(c, [cx, cy], [x, y]); });
            }
        }
        c.fillStyle = A(0.9 * k);
        dot(c, cx, cy, 2.4);
    },
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const dpr = Math.min(devicePixelRatio || 1, 2);

type Item = { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; draw: Draw; w: number; h: number; t: number; k: number; hot: boolean; seen: boolean };
const items: Item[] = [];
document.querySelectorAll<HTMLCanvasElement>('canvas[data-motif]').forEach((canvas, i) => {
    const ctx = canvas.getContext('2d');
    const draw = motifs[canvas.dataset.motif ?? ''];
    if (!ctx || !draw) return;
    const item: Item = { canvas, ctx, draw, w: 0, h: 0, t: 4 + i * 3.7, k: 0.85, hot: false, seen: false };
    items.push(item);
    const card = canvas.closest('a');
    card?.addEventListener('pointerenter', () => { item.hot = true; kick(); });
    card?.addEventListener('pointerleave', () => { item.hot = false; });
});

const size = (it: Item) => {
    it.w = it.canvas.clientWidth;
    it.h = it.canvas.clientHeight;
    it.canvas.width = Math.round(it.w * dpr);
    it.canvas.height = Math.round(it.h * dpr);
};
const paint = (it: Item) => {
    const { ctx } = it;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, it.w, it.h);
    it.draw(ctx, it.w, it.h, it.t, it.k);
};

let raf = 0;
let last = 0;
const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    let any = false;
    for (const it of items) {
        if (!it.seen) continue;
        any = true;
        it.k += ((it.hot ? 1.45 : 0.85) - it.k) * 0.08;
        it.t += dt * (0.4 + (it.k - 0.85) * 2.5 + 0.6);
        paint(it);
    }
    raf = any ? requestAnimationFrame(frame) : 0;
};
const kick = () => {
    if (reduce || raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
};

const ro = new ResizeObserver(() => items.forEach((it) => { size(it); paint(it); }));
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        const it = items.find((x) => x.canvas === e.target);
        if (it) it.seen = e.isIntersecting;
    });
    kick();
});
items.forEach((it) => {
    size(it);
    paint(it);
    ro.observe(it.canvas);
    io.observe(it.canvas);
});
