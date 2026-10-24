# Portfolio · Félix Corcoran

Mi portfolio de desarrollador: [dev.felixcorcoran.es](https://dev.felixcorcoran.es) (en inglés en [/en](https://dev.felixcorcoran.es/en/)).

Proyectos con capturas, experiencia, stack y contacto, con una animación distinta en cada zona. El currículum en PDF sale de los mismos datos que la web.

## Una sola fuente de datos

Todo el contenido (proyectos, experiencia, stack, formación, idiomas) está en [`src/data/perfil.ts`](src/data/perfil.ts), en español e inglés. De ahí salen:

- las secciones de la web (`src/components/HomeContent.astro`), y
- el currículum: `npm run cv` genera `public/cv-felix-corcoran.pdf` (español) y `public/resume-felix-corcoran.pdf` (inglés) imprimiendo HTML a PDF con Edge o Chrome. Está pensado para que lo lea bien un ATS: texto real, una columna de lectura y enlaces escritos.

Al cambiar `perfil.ts` o `cv/`, una GitHub Action ([`cv.yml`](.github/workflows/cv.yml)) regenera los dos PDF y los sube al repositorio.

## Stack

- **Astro 6** con salida en servidor en **Vercel** (el formulario de contacto es una función que envía el correo con **Resend**).
- **Tailwind CSS 4** y animaciones propias en CSS y JavaScript, sin librerías: entradas al llegar con `IntersectionObserver`, titulares ligados al scroll y un cambio de idioma animado entre `/` y `/en/`.
- Capturas optimizadas con `astro:assets` e iconos del stack servidos desde el propio proyecto (Simple Icons).

## En local

```sh
npm install
npm run dev     # http://localhost:4321
npm run cv      # regenera los PDF del currículum
```

El formulario necesita la variable `RESEND_API_KEY` (en Vercel o en un `.env` local).
