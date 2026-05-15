import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// Endpoint PUT: Cancela el alquiler activo de una saga completa para un usuario específico
export async function PUT(request: Request) {
  try {
    // Extracción y validación de los datos recibidos
    const { email, sagaId } = await request.json();

    if (!email || !sagaId) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Consulta a la base de datos: Verifica la existencia del usuario por el email
    const user = await prisma.usuarios.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    // Consulta a la base de datos: Obtiene la saga incluyendo sus películas
    const saga = await prisma.sagas.findUnique({
      where: { id: sagaId },
      include: { movies: true }
    });

    if (!saga) return NextResponse.json({ error: "Saga no encontrada" }, { status: 404 });

    // Extrae un array con los IDs de las películas de la saga
    const movieIds = saga.movies.map(m => m.id);

    // Actualización (Bulk Update): Modifica el estado de los alquileres en la base de datos
    await prisma.alquileres.updateMany({
      where: {
        userId: user.id,
        movieId: { in: movieIds },
        canceled: false, 
      },
      data: {
        canceled: true,
      }
    });

    // Respuesta
    return NextResponse.json({ message: "Alquiler cancelado correctamente" }, { status: 200 });

  } catch (error) {
    // Manejo de excepciones en caso de fallo
    return NextResponse.json({ error: "Error al cancelar el alquiler" }, { status: 500 });
  }
}