import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

// Definimos la función POST, que se ejecutará cuando alguien envíe datos a esta ruta
export async function POST(request: Request) {
  try {
    // Extraemos y leemos el cuerpo de la petición (lo que el usuario ha escrito en el formulario)
    const body = await request.json();
    const { email, password } = body;

    // Validación de seguridad: comprobamos que no nos envíen campos vacíos
    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Cifrado de contraseña:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserción en base de datos: le decimos a Prisma que cree un nuevo registro en la tabla usuarios
    const newUser = await prisma.usuarios.create({
      data: {
        email: email,
        password: hashedPassword, 
        role: "CLIENT", 
      },
    });

    // Si todo ha ido bien, devolvemos un código 201 y un mensaje de éxito
    return NextResponse.json({ message: "Usuario creado con éxito", user: newUser.email }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear usuario o el email ya existe" }, { status: 500 });
  }
}
