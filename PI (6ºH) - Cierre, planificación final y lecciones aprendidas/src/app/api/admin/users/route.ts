import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

// Endpoint POST: Creación de un nuevo usuario
export async function POST(request: Request) {
  try {
    // Extracción de datos 
    const { email, password, role } = await request.json();

    // Validación de campos requeridos
    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Seguridad: Encriptación de la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserción del nuevo registro de usuario en la base de datos
    const newUser = await prisma.usuarios.create({
      data: {
        email: email,
        password: hashedPassword,
        role: role || "CLIENT",
      },
    });

    // Respuesta de éxito
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    // Manejo de errores
    console.error("Error al crear el usuario:", error);
    return NextResponse.json({ error: "Error al crear el usuario (¿email duplicado?)" }, { status: 500 });
  }
}

// Endpoint DELETE: Eliminación de un usuario existente
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del usuario" }, { status: 400 });
    }

    // Eliminación en cascada de los alquileres asociados al usuario
    await prisma.alquileres.deleteMany({
      where: { userId: id }
    });

    // Eliminación del registro principal del usuario
    await prisma.usuarios.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Usuario eliminado correctamente" }, { status: 200 });
  } catch (error) {
    // Manejo de errores
    console.error("Error al eliminar el usuario:", error);
    return NextResponse.json({ error: "Error al eliminar el usuario" }, { status: 500 });
  }
}

// Endpoint PUT: Actualización de los datos de un usuario
export async function PUT(request: Request) {
  try {
    // Extracción de los datos enviados 
    const { id, email, password, role } = await request.json();

    if (!id || !email || !role) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // Preparación de los datos a actualizar 
    const updateData: any = { email, role };

    // Solo se encripta y se añade la contraseña si el admin da una nueva
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Actualización en la base de datos
    const updatedUser = await prisma.usuarios.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    // Manejo de errores
    console.error("Error al actualizar el usuario:", error);
    return NextResponse.json({ error: "Error al actualizar (¿quizás ese email ya está en uso?)" }, { status: 500 });
  }
}