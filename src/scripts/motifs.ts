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

type Pt = [number, number];
const smooth = (v: number) => { const x = clamp01(v); return x * x * (3 - 2 * x); };
// Opacidad de un ciclo: entra, se mantiene y se funde al final para volver a empezar
const cycleFade = (ph: number, out = 0.93) => 1 - smooth((ph - out) / (1 - out));
// Dibuja los tramos en orden hasta «prog» (0-1 del largo total) y devuelve la
// punta del trazo, donde va el punto que dibuja
const trace = (c: CanvasRenderingContext2D, segs: [Pt, Pt][], prog: number): Pt | null => {
    const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
    let left = lens.reduce((x, y) => x + y, 0) * clamp01(prog);
    let head: Pt | null = null;
    for (let i = 0; i < segs.length && left > 0; i++) {
        const [a, b] = segs[i];
        const f = Math.min(1, left / (lens[i] || 1));
        line(c, a, b, f);
        head = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        left -= lens[i];
    }
    return prog >= 1 ? null : head;
};
// El punto que dibuja: núcleo blanco azulado con halo
const pen = (c: CanvasRenderingContext2D, p: Pt | null, k: number) => {
    if (!p) return;
    c.fillStyle = A(0.2 * k);
    dot(c, p[0], p[1], 7);
    c.fillStyle = A(1 * k);
    dot(c, p[0], p[1], 2.2);
};

const motifs: Record<string, Draw> = {
    // Obra: la torre sube planta a planta (el punto marca dónde se construye);
    // terminada, se encienden las ventanas una a una, se mantiene y vuelve a empezar
    tower(c, w, h, t, k) {
        const u = Math.min(w, h) / 12.5;
        const P = iso(w * 0.5, h * 0.76, u);
        const ph = (t / 18) % 1;
        const fade = cycleFade(ph, 0.9);
        floorDots(c, P, 4, k);
        const kk = k * fade;
        const floors = 5, s = 1.4, fh = 1.05;
        const built = smooth(ph / 0.55) * floors;
        const corners: Pt[] = [[-s, -s], [s, -s], [s, s], [-s, s]];
        c.lineWidth = 1;
        // Losa de la planta baja
        c.strokeStyle = A(0.45 * kk);
        for (let i = 0; i < 4; i++) line(c, P(...corners[i], 0), P(...corners[(i + 1) % 4], 0));
        let head: Pt | null = null;
        for (let f = 0; f < floors; f++) {
            const p = clamp01(built - f);
            if (p <= 0) break;
            const z0 = f * fh;
            // Primero suben los pilares y después se cierra el forjado de arriba
            const up = clamp01(p / 0.55);
            const ring = clamp01((p - 0.55) / 0.45);
            c.strokeStyle = A((0.35 + 0.4 * (f + 1) / floors) * kk);
            corners.forEach(([x, y]) => line(c, P(x, y, z0), P(x, y, z0 + fh * up)));
            const ringSegs: [Pt, Pt][] = corners.map((cn, i) => [P(...cn, z0 + fh), P(...corners[(i + 1) % 4], z0 + fh)]);
            const tip = ring > 0 ? trace(c, ringSegs, ring) : null;
            if (p < 1) head = tip ?? P(-s, -s, z0 + fh * up);
        }
        pen(c, head, kk);
        // Ventanas: dos por planta en cada fachada visible, encendiéndose en orden
        const lit = clamp01((ph - 0.58) / 0.22) * floors * 4;
        let n = 0;
        for (let f = 0; f < floors && built >= floors; f++) {
            for (const face of [1, 2]) {
                const [x0, y0] = corners[face];
                const [x1, y1] = corners[(face + 1) % 4];
                for (const m of [0.3, 0.7]) {
                    const on = clamp01(lit - n);
                    n++;
                    const x = x0 + (x1 - x0) * m, y = y0 + (y1 - y0) * m;
                    const a = P(x - (x1 - x0) * 0.1, y - (y1 - y0) * 0.1, f * fh + 0.3);
                    const b = P(x + (x1 - x0) * 0.1, y + (y1 - y0) * 0.1, f * fh + 0.3);
                    const cc = P(x + (x1 - x0) * 0.1, y + (y1 - y0) * 0.1, f * fh + 0.75);
                    const d = P(x - (x1 - x0) * 0.1, y - (y1 - y0) * 0.1, f * fh + 0.75);
                    c.beginPath();
                    c.moveTo(...a); c.lineTo(...b); c.lineTo(...cc); c.lineTo(...d); c.closePath();
                    c.fillStyle = A((0.06 + 0.5 * on) * kk);
                    c.fill();
                    c.strokeStyle = A((0.25 + 0.4 * on) * kk);
                    c.stroke();
                }
            }
        }
    },

    // Nave: el punto la va trazando arista a arista (suelo, pórticos y
    // largueros); terminada, se mantiene y se funde para empezar otra vez
    hall(c, w, h, t, k) {
        const u = Math.min(w, h) / 12;
        const P = iso(w * 0.5, h * 0.62, u);
        const ph = (t / 16) % 1;
        const kk = k * cycleFade(ph, 0.88);
        floorDots(c, P, 5, k);
        const X = 2.8, Y = 1.8, Z = 1.4, R = 2.4, n = 5;
        const xs = Array.from({ length: n }, (_, i) => -X + (2 * X * i) / (n - 1));
        const segs: [Pt, Pt][] = [
            [P(-X, -Y, 0), P(X, -Y, 0)], [P(X, -Y, 0), P(X, Y, 0)], [P(X, Y, 0), P(-X, Y, 0)], [P(-X, Y, 0), P(-X, -Y, 0)],
        ];
        xs.forEach((x, i) => {
            // Pórtico: pilar, faldón, faldón y pilar
            segs.push([P(x, -Y, 0), P(x, -Y, Z)], [P(x, -Y, Z), P(x, 0, R)], [P(x, 0, R), P(x, Y, Z)], [P(x, Y, Z), P(x, Y, 0)]);
            // Largueros que lo unen con el anterior
            if (i > 0) segs.push([P(xs[i - 1], Y, Z), P(x, Y, Z)], [P(xs[i - 1], 0, R), P(x, 0, R)], [P(xs[i - 1], -Y, Z), P(x, -Y, Z)]);
        });
        c.lineWidth = 1;
        c.strokeStyle = A(0.6 * kk);
        const head = trace(c, segs, smooth(ph / 0.7));
        pen(c, head, kk);
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

    // Reformas: una reforma contada en un plano sencillo. Se dibuja una
    // vivienda (cocina cerrada, salón, dormitorio y baño); el tabique de la
    // cocina se marca y se derriba, el espacio queda abierto, se pone suelo
    // nuevo y aparece una isla. Se mantiene, se funde y vuelve a empezar.
    plan(c, w, h, t, k) {
        const s = Math.min(w / 12.5, h / 9);
        const ox = w * 0.5 - 5 * s, oy = h * 0.54 - 3.25 * s;
        const Q = (x: number, y: number): Pt => [ox + x * s, oy + y * s];
        const ph = (t / 26) % 1;
        const kk = k * cycleFade(ph, 0.93);
        c.lineWidth = 1;

        // 1. Muros (con los huecos de las puertas), trazados por el punto
        const walls: [Pt, Pt][] = ([
            [0, 0, 10, 0], [10, 0, 10, 6.5], [10, 6.5, 2.5, 6.5], [1.5, 6.5, 0, 6.5], [0, 6.5, 0, 0],
            [6, 0, 6, 1.4], [6, 2.2, 6, 4.6], [6, 5.4, 6, 6.5], [6, 3.8, 10, 3.8],
        ] as const).map(([a1, b1, c1, d1]) => [Q(a1, b1), Q(c1, d1)]);
        c.strokeStyle = A(0.62 * kk);
        const head = trace(c, walls, smooth(ph / 0.24));
        pen(c, head, kk);

        // 2. Puertas y ventanas
        const det = smooth((ph - 0.24) / 0.06) * kk;
        const door = (hx: number, hy: number, ax: number, ay: number, px: number, py: number, len: number) => {
            const hinge = Q(hx, hy);
            line(c, hinge, Q(hx + px * len, hy + py * len));
            const a0 = Math.atan2(py, px), a1 = Math.atan2(ay, ax);
            let d = a1 - a0;
            while (d > Math.PI) d -= TAU;
            while (d < -Math.PI) d += TAU;
            c.beginPath();
            c.arc(hinge[0], hinge[1], len * s, a0, a1, d < 0);
            c.stroke();
        };
        if (det > 0) {
            c.strokeStyle = A(0.35 * det);
            door(1.5, 6.5, 1, 0, 0, -1, 1); // entrada
            door(6, 1.4, 0, 1, 1, 0, 0.8); // dormitorio
            door(6, 4.6, 0, 1, 1, 0, 0.8); // baño
            c.strokeStyle = A(0.5 * det);
            for (const [x0, x1] of [[3.6, 5.4], [7, 9]]) {
                line(c, Q(x0, -0.13), Q(x1, -0.13));
                line(c, Q(x0, 0.13), Q(x1, 0.13));
            }
            c.strokeStyle = A(0.22 * det);
            line(c, Q(0, -0.7), Q(10, -0.7));
            line(c, Q(0, -0.9), Q(0, -0.5));
            line(c, Q(10, -0.9), Q(10, -0.5));
        }

        // 3. Tabique de la cocina: aparece, se marca a trazos y se derriba de
        //    arriba abajo (el punto va cortándolo)
        const built = smooth((ph - 0.27) / 0.05);
        const mark = clamp01((ph - 0.4) / 0.08);
        const gone = smooth((ph - 0.48) / 0.12);
        if (built > 0 && gone < 1) {
            const top = 6.5 * gone;
            const parts: [number, number][] = [[0, 2.6], [3.4, 6.5]];
            c.strokeStyle = A(0.62 * kk * built);
            c.setLineDash(mark > 0 ? [4, 4] : []);
            c.lineDashOffset = -t * 20;
            for (const [y0, y1] of parts) {
                const a0 = Math.max(y0, top);
                if (a0 < y1) line(c, Q(3, a0), Q(3, y1));
            }
            c.setLineDash([]);
            if (gone === 0 && det > 0) {
                c.strokeStyle = A(0.35 * det * built);
                door(3, 2.6, 0, 1, 1, 0, 0.8);
            }
            if (gone > 0) pen(c, Q(3, top), kk);
        }

        // 4. Suelo nuevo en el espacio abierto: rayado que barre de izquierda a derecha
        const floor = smooth((ph - 0.62) / 0.14);
        if (floor > 0) {
            c.save();
            const [fx, fy] = Q(0, 0);
            c.beginPath();
            c.rect(fx, fy, 6 * s * floor, 6.5 * s);
            c.clip();
            c.strokeStyle = A(0.13 * kk);
            for (let d = -6.5; d < 6; d += 0.45) line(c, Q(d, 6.5), Q(d + 6.5, 0));
            c.restore();
            if (floor < 1) pen(c, Q(6 * floor, 3.25), kk);
        }

        // 5. Cocina abierta: encimera y una isla
        const fit = smooth((ph - 0.76) / 0.06) * kk;
        if (fit > 0) {
            c.strokeStyle = A(0.5 * fit);
            const R = (x: number, y: number, ww: number, hh: number) => { const [a1, b1] = Q(x, y); c.strokeRect(a1, b1, ww * s, hh * s); };
            R(0.2, 0.2, 0.7, 3.2);
            R(2.2, 1.4, 1.8, 0.9);
        }
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

// Solo en desarrollo: para revisar fotogramas desde la consola
if (import.meta.env.DEV) Object.assign(window, { __motifs: { items, paint } });
