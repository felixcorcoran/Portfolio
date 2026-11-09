import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Lo que escribe el visitante se escapa antes de meterlo en el HTML del correo
const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const nombre = String(formData.get('nombre') ?? '').trim();
  const correo = String(formData.get('correo') ?? '').trim();
  const proyecto = String(formData.get('proyecto') ?? '').trim();

  if (!nombre || !correo || !proyecto || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return new Response(JSON.stringify({ message: "Faltan campos" }), { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'felixxjbk@gmail.com',
      // «Responder» en el correo contesta directamente a quien escribió
      replyTo: correo,
      subject: `Nuevo mensaje: ${nombre.slice(0, 80)}`,
      html: `
        <h1>Nuevo contacto del Portfolio</h1>
        <p><strong>Nombre:</strong> ${escape(nombre)}</p>
        <p><strong>Email:</strong> ${escape(correo)}</p>
        <p><strong>Mensaje:</strong> ${escape(proyecto).replace(/\n/g, '<br>')}</p>
      `,
    });

    return new Response(JSON.stringify({ message: "Email enviado con éxito" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error al enviar" }), { status: 500 });
  }
};