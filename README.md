# Portfolio · Félix Corcoran

Mi portfolio de desarrollador: [dev.felixcorcoran.es](https://dev.felixcorcoran.es) (en inglés en [/en](https://dev.felixcorcoran.es/en/)).

Proyectos con capturas, experiencia, stack y contacto, con scroll suave y animaciones ligadas al scroll. El currículum en PDF sale de los mismos datos que la web.

## Una sola fuente de datos

Todo el contenido (proyectos, experiencia, stack, formación, idiomas) está en [`src/data/perfil.ts`](src/data/perfil.ts), en español e inglés. De ahí salen:

- las secciones de la web (`src/components/Portfolio.astro`, con estilos en `src/styles/portfolio.css` y animaciones en `src/scripts/motion.ts`), y
- el currículum: `npm run cv` genera `public/cv-felix-corcoran.pdf` (español) y `public/resume-felix-corcoran.pdf` (inglés) imprimiendo HTML a PDF con Edge o Chrome. Está pensado para que lo lea bien un ATS: texto real, una columna de lectura y enlaces escritos.

Al cambiar `perfil.ts` o `cv/`, una GitHub Action ([`cv.yml`](.github/workflows/cv.yml)) regenera los dos PDF y los sube al repositorio.

## Stack

- **Astro 6** con salida en servidor en **Vercel** (el formulario de contacto es una función que envía el correo con **Resend**).
- **GSAP** (ScrollTrigger) y **Lenis** para el scroll suave y las animaciones: portada que entra al cargar, texto que se ilumina con el scroll, tarjetas de proyecto que se apilan, galería horizontal y contacto que se abre. En móvil y en pantallas bajas no hay secciones fijadas; con «reducir movimiento», todo queda estático.
- **Tailwind CSS 4** solo para el reset; el resto, CSS propio. Tipografías Archivo, Instrument Serif y JetBrains Mono servidas desde el proyecto (Fontsource).
- Capturas optimizadas con `astro:assets` e iconos del stack servidos desde el propio proyecto (Simple Icons).

## En local

```sh
npm install
npm run dev     # http://localhost:4321
npm run cv      # regenera los PDF del currículum
```

El formulario necesita la variable `RESEND_API_KEY` (en Vercel o en un `.env` local).
