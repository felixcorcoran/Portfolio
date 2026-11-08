/**
 * Fondo de la portada: humo azul con grano, hecho con un shader (WebGL 1,
 * sin librerías). Va lento, se inclina un poco hacia el ratón y se para
 * cuando la portada no está en pantalla o la pestaña está oculta. Con
 * «reducir movimiento» se pinta una sola vez, quieto. Sin WebGL, no hay humo.
 */
const canvas = document.querySelector<HTMLCanvasElement>('[data-smoke]');
const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });

if (canvas && gl) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = matchMedia('(max-width: 760px)').matches;

    const vert = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
    const frag = `
precision mediump float;
uniform vec2 r;
uniform float t;
uniform vec2 m;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / r;
    vec2 p = (gl_FragCoord.xy - 0.5 * r) / r.y;
    p += (m - 0.5) * vec2(0.12, -0.08);
    float tt = t * 0.035;

    // Humo: ruido deformado por otro ruido (domain warping)
    vec2 q = vec2(fbm(p * 1.5 + tt), fbm(p * 1.5 + vec2(5.2, 1.3) - tt));
    float n = fbm(p * 1.3 + 2.4 * q + vec2(tt * 0.7, -tt * 0.5));

    // Concentrado a la derecha y abajo, detrás del nombre; se apaga hacia los bordes
    vec2 c = vec2(0.22 + 0.06 * sin(t * 0.05), -0.1);
    float d = length((p - c) * vec2(0.8, 1.15));
    float mask = smoothstep(1.35, 0.0, d) * smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.75, uv.y);
    float smoke = smoothstep(0.28, 0.82, n) * mask;

    vec3 bg = vec3(0.039, 0.039, 0.043);
    vec3 deep = vec3(0.10, 0.14, 0.42);
    vec3 glow = vec3(0.48, 0.58, 1.0);
    vec3 col = bg + mix(deep, glow, smoothstep(0.25, 0.95, smoke)) * smoke * 1.35;

    // Grano de película
    float g = hash(gl_FragCoord.xy + fract(t * 0.73) * 113.0) - 0.5;
    col += g * 0.045;
    gl_FragColor = vec4(col, 1.0);
}`;

    const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);

    if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const uR = gl.getUniformLocation(prog, 'r');
        const uT = gl.getUniformLocation(prog, 't');
        const uM = gl.getUniformLocation(prog, 'm');

        // El humo es borroso: se pinta a menos resolución y el CSS lo escala
        const scale = small ? 0.5 : 0.7;
        const resize = () => {
            const w = Math.max(1, Math.round(canvas.clientWidth * scale));
            const h = Math.max(1, Math.round(canvas.clientHeight * scale));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
        };

        const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
        addEventListener('pointermove', (e) => {
            mouse.tx = e.clientX / innerWidth;
            mouse.ty = e.clientY / innerHeight;
        }, { passive: true });

        const draw = (time: number) => {
            resize();
            mouse.x += (mouse.tx - mouse.x) * 0.04;
            mouse.y += (mouse.ty - mouse.y) * 0.04;
            gl.uniform2f(uR, canvas.width, canvas.height);
            gl.uniform1f(uT, time);
            gl.uniform2f(uM, mouse.x, mouse.y);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        if (reduce) {
            draw(12);
            addEventListener('resize', () => draw(12));
        } else {
            let visible = true;
            let raf = 0;
            const start = performance.now();
            const loop = (now: number) => {
                draw((now - start) / 1000 + 12);
                raf = requestAnimationFrame(loop);
            };
            const run = () => {
                cancelAnimationFrame(raf);
                if (visible && !document.hidden) raf = requestAnimationFrame(loop);
            };
            new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; run(); }).observe(canvas);
            document.addEventListener('visibilitychange', run);
            draw(12);
            run();
        }
        canvas.classList.add('is-on');
    }
}
