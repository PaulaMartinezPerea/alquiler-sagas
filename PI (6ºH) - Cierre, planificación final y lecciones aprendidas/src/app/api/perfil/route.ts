import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

// Endpoint POST: Recupera los datos del perfil del usuario y su historial completo de alquileres
export async function POST(request: Request) {
  try {
    // Extracción y validación del email
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Falta email" }, { status: 400 });

    // Consulta a la base de datos: Busca el usuario y sus relaciones (alquileres > películas > saga)
    const user = await prisma.usuarios.findUnique({
      where: { email },
      include: {
        rentals: {
          include: {
            movie: {
              include: {
                saga: true 
              }
            }
          }
        }
      }
    });

    // Manejo de respuestas 
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// Endpoint PUT: Actualiza la contraseña del usuario 
export async function PUT(request: Request) {
  try {
    // Validación de los datos (email y la nueva contraseña)
    const { email, newPassword } = await request.json();
    if (!email || !newPassword) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

    // Encriptación (Hashing) de la nueva contraseña usando bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualización del registro del usuario en la base de datos
    await prisma.usuarios.update({
      where: { email },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "Contraseña actualizada con éxito" }, { status: 200 });
  } catch (error) {
    // Manejo de errores
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}