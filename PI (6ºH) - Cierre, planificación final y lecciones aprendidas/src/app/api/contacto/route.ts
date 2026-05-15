import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Endpoint POST: Procesa el formulario de contacto y envía un correo electrónico
export async function POST(req: Request) {
  try {
    // Extracción de los datos enviados desde el frontend
    const body = await req.json();
    const { nombre, email, telefono, asunto, mensaje } = body;

    // Validación 1: Comprueba que no falten campos obligatorios
    if (!nombre || !email || !mensaje || !telefono) {
      return NextResponse.json(
        { ok: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validación 2: Comprueba el formato del teléfono
    const soloNumeros = telefono.replace(/\D/g, ''); 
    if (soloNumeros.length < 9) {
      return NextResponse.json(
        { ok: false, message: 'El teléfono debe tener al menos 9 números.' },
        { status: 400 }
      );
    }

    // Validación 3: Comprueba el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, message: 'El formato del correo electrónico no es válido.' },
        { status: 400 }
      );
    }

    // Configuración del servicio de correo (SMTP) utilizando variables de entorno 
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construcción del contenido del correo (remitente, destinatario, asunto y cuerpo HTML)
    const mailOptions = {
      from: `"Contacto Alquiler Sagas" <${process.env.EMAIL_USER}>`,
      to: 'martinezpereapaula@gmail.com', 
      subject: `¡Nuevo mensaje!: ${asunto || 'Sin asunto'}`,
      html: `
        <hr/>
        <h3>Contacto recibido:</h3>
        <p><strong>Nombre -</strong> ${nombre}</p>
        <p><strong>Email -</strong> ${email}</p>
        <p><strong>Teléfono -</strong> ${telefono}</p>
        <hr/>
        <p><strong>Asunto:</strong></p>
        <p>${asunto}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    };

    // Envío asíncrono del correo electrónico
    await transporter.sendMail(mailOptions);

    // Respuesta de éxito 
    return NextResponse.json({
      ok: true,
      message: 'Mensaje enviado correctamente. Contactaremos contigo pronto.',
    });

  } catch (error) {
    // Manejo de errores
    console.error('Error enviando email:', error);
    return NextResponse.json(
      { ok: false, message: 'Error en el servidor al enviar el correo. Revisa la consola.' },
      { status: 500 }
    );
  }
}