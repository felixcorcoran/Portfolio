/**
 * «Ver la demo»: abre el vídeo sobre la página en vez de llevar a GitHub.
 * El enlace apunta al .mp4, así que sin JavaScript también se ve.
 */
const dialog = document.querySelector<HTMLDialogElement>('.vdialog');
const video = dialog?.querySelector('video');

if (dialog && video) {
    const cerrar = () => dialog.close();
    dialog.addEventListener('close', () => {
        video.pause();
        document.documentElement.classList.remove('vopen');
    });
    // Fuera del vídeo (en el fondo oscuro) también cierra
    dialog.addEventListener('click', (e) => { if (e.target === dialog) cerrar(); });
    dialog.querySelector('.vdialog-close')?.addEventListener('click', cerrar);

    document.querySelectorAll<HTMLAnchorElement>('a[data-video]').forEach((a) => {
        a.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            const base = a.dataset.video!;
            if (video.getAttribute('src') !== `${base}.mp4`) {
                video.poster = `${base}.jpg`;
                video.src = `${base}.mp4`;
            }
            dialog.setAttribute('aria-label', a.dataset.videoTitle ?? dialog.getAttribute('aria-label') ?? '');
            document.documentElement.classList.add('vopen');
            dialog.showModal();
            video.currentTime = 0;
            video.play().catch(() => {});
        });
    });
}
