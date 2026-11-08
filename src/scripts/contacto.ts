/** Formulario de contacto: envía a /api/send-email (Resend) sin recargar. */
const form = document.getElementById('contact-form') as HTMLFormElement | null;
const btnText = document.getElementById('btn-text');
const successMsg = document.getElementById('success-msg');
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null;

if (form && btnText && successMsg && submitBtn) {
    // Textos del botón en el idioma de la página (data-* del formulario)
    const label = form.dataset;
    const enable = () => { submitBtn.disabled = false; };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnText.textContent = label.sending ?? '';
        submitBtn.disabled = true;
        try {
            const response = await fetch('/api/send-email', { method: 'POST', body: new FormData(form) });
            if (response.ok) {
                form.reset();
                btnText.textContent = label.sent ?? '';
                successMsg.hidden = false;
                setTimeout(() => {
                    successMsg.hidden = true;
                    btnText.textContent = label.send ?? '';
                    enable();
                }, 5000);
            } else {
                btnText.textContent = label.error ?? '';
                enable();
            }
        } catch {
            btnText.textContent = label.failed ?? '';
            enable();
        }
    });
}
