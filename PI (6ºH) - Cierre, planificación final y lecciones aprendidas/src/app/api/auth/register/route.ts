import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

// Endpoint POST: Procesa el registro de usuarios
export async function POST(request: Request) {
  try {
    // Extracción de los datos enviados
    const body = await request.json();
    const { email, password } = body;

    // Validación: Comprueba que se hayan enviado ambos campos
    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Seguridad: Encriptación (hashing) de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Consulta a la base de datos: Creación del nuevo registro de usuario
    const newUser = await prisma.usuarios.create({
      data: {
        email: email,
        password: hashedPassword, 
        role: "CLIENT", 
      },
    });

    // Respuesta de éxito
    return NextResponse.json({ message: "Usuario creado con éxito", user: newUser.email }, { status: 201 });
  } catch (error) {
    // Manejo de errores
    return NextResponse.json({ error: "Error al crear usuario o el email ya existe" }, { status: 500 });
  }
}