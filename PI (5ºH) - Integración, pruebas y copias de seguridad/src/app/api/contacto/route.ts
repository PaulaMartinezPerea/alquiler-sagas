import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Definición del endpoint que procesará las peticiones HTTP POST
export async function POST(req: Request) {
  try {
    // Extracción y desestructuración de los datos enviados en el cuerpo de la petición
    const body = await req.json();
    const { nombre, email, telefono, asunto, mensaje } = body;

    // Validación de presencia de datos
    if (!nombre || !email || !mensaje || !telefono) {
      return NextResponse.json(
        { ok: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Elimina cualquier carácter que no sea un número 
    const soloNumeros = telefono.replace(/\D/g, ''); 
    if (soloNumeros.length < 9) {
      return NextResponse.json(
        { ok: false, message: 'El teléfono debe tener al menos 9 números.' },
        { status: 400 }
      );
    }

    // Validación de formato para el email mediante una expresión regular básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, message: 'El formato del correo electrónico no es válido.' },
        { status: 400 }
      );
    }

    // Configuración del cliente SMTP utilizando Nodemailer y las variables de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      // Usar SSL/TLS
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construcción del objeto de correo definiendo cabeceras, destinatario y plantilla HTML
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

    // Instrucción asíncrona que ejecuta el envío real del correo hacia el servidor SMTP configurado
    await transporter.sendMail(mailOptions);

    // Retorno de una respuesta exitosa 
    return NextResponse.json({
      ok: true,
      message: 'Mensaje enviado correctamente. Contactaremos contigo pronto.',
    });

  } catch (error) {
    // Captura de cualquier excepción durante el proceso 
    console.error('Error enviando email:', error);
    return NextResponse.json(
      { ok: false, message: 'Error en el servidor al enviar el correo. Revisa la consola.' },
      { status: 500 }
    );
  }
}