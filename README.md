# Portfolio · Félix Corcoran

Mi portfolio de desarrollador: [dev.felixcorcoran.es](https://dev.felixcorcoran.es) (en inglés en [/en](https://dev.felixcorcoran.es/en/)).

Proyectos, webs para negocios, experiencia, stack y contacto, con scroll suave y animaciones ligadas al scroll. El currículum en PDF sale de los mismos datos que la web.

## Una sola fuente de datos

Todo el contenido (proyectos, experiencia, stack, formación, idiomas) está en [`src/data/perfil.ts`](src/data/perfil.ts), en español e inglés. De ahí salen:

- las secciones de la web ([`src/components/Portfolio.astro`](src/components/Portfolio.astro), con estilos en [`src/styles/portfolio.css`](src/styles/portfolio.css)), y
- el currículum: `npm run cv` genera `public/cv-felix-corcoran.pdf` (español) y `public/resume-felix-corcoran.pdf` (inglés) imprimiendo HTML a PDF con Edge o Chrome. Está pensado para que lo lea bien un ATS: texto real, una columna de lectura y enlaces escritos.

Las tecnologías de `cvOnly` (en `perfil.ts`) salen en el CV pero no en el Stack de la web. Los textos de la interfaz están en [`src/utils/i18n.js`](src/utils/i18n.js).

Al cambiar `perfil.ts` o `cv/`, una GitHub Action ([`cv.yml`](.github/workflows/cv.yml)) regenera los dos PDF y los sube al repositorio.

## Secciones y animaciones

| Sección | Escritorio | Móvil |
| --- | --- | --- |
| Portada | Nombre que entra al cargar sobre humo azul con grano que se queda en la parte baja (shader WebGL, [`smoke.ts`](src/scripts/smoke.ts)); con ratón, las letras adelgazan al acercarse el cursor ([`proximity.ts`](src/scripts/proximity.ts), también en el nombre del pie) | Igual, más ligero y sin efecto de letras |
| Cinta | Dos bandas cruzadas que corren con el scroll | Igual |
| Mis trabajos | Tarjetas que se apilan: llegan inclinadas en 3D, la captura se descubre y la de debajo se hunde; contador que gira | Carrusel horizontal ([`carrusel.ts`](src/scripts/carrusel.ts)) |
| Webs para negocios | Tarjetas tipográficas que se desplazan en horizontal al bajar; con ratón, la captura sigue al cursor con física y barrido entre webs ([`preview.ts`](src/scripts/preview.ts)) | Igual, sin captura (se toca y abre la web) |
| Experiencia | El título se enciende letra a letra y queda fijo a la izquierda con contador; línea que se dibuja hasta un marcador fijo a media pantalla y el hito que lo cruza se colorea de izquierda a derecha | Línea a la izquierda, mismo efecto |
| Stack | Globo de alambre con las tecnologías que se puede arrastrar; se encienden las del grupo activo ([`globe.ts`](src/scripts/globe.ts)) | Lista por grupos |
| Contacto | Tarjeta que crece hasta su tamaño; pie con el nombre sobre un horizonte azul y estrellas ([`stars.ts`](src/scripts/stars.ts)) | Igual |

Las animaciones de scroll están en [`src/scripts/motion.ts`](src/scripts/motion.ts) (GSAP + ScrollTrigger + Lenis). Las secciones fijadas solo se fijan en pantallas de más de 600 px de alto; con «reducir movimiento» no se carga nada de esto y la página se ve entera y estática. Al cambiar ES/EN, la otra versión se abre en el mismo punto de lectura ([`idioma.ts`](src/scripts/idioma.ts)).

## Stack

- **Astro 6** con salida en servidor en **Vercel**. El formulario de contacto es una función ([`send-email.ts`](src/pages/api/send-email.ts)) que envía el mensaje por correo con **Resend**.
- **GSAP** y **Lenis** para el scroll y las animaciones; canvas y WebGL propios para el humo, el globo y las estrellas, sin librerías 3D.
- **Tailwind CSS 4** solo para el reset; el resto, CSS propio. Tipografías Archivo, Instrument Serif y JetBrains Mono servidas desde el proyecto (Fontsource).
- Capturas optimizadas con `astro:assets` e iconos del stack servidos desde el propio proyecto (Simple Icons).

## En local

```sh
npm install
npm run dev     # http://localhost:4321
npm run cv      # regenera los PDF del currículum
npm run og      # regenera public/og.png, la imagen al compartir el enlace
```

El formulario necesita la variable `RESEND_API_KEY` (en Vercel o en un `.env` local). Si se instalan paquetes con el servidor de desarrollo arrancado, hay que reiniciarlo: si no, las imágenes nuevas fallan con «Could not find Sharp».

La política de privacidad del formulario está en felixcorcoran.es ([`/privacidad#portfolio`](https://felixcorcoran.es/privacidad#portfolio)), en el repositorio de la web de servicios.
