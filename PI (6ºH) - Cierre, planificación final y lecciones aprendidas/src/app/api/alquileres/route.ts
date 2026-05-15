import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// Endpoint POST: Procesa la creación de un nuevo alquiler de saga completa
export async function POST(request: Request) {
  try {
    // Extracción y validación de los parámetros 
    const { email, sagaId, duracion } = await request.json();

    if (!email || !sagaId || !duracion) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Consulta a la BD: Obtiene el registro completo del usuario por su email
    const user = await prisma.usuarios.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Consulta a la BD: Recupera la saga incluyendo todas sus películas
    const saga = await prisma.sagas.findUnique({
      where: { id: sagaId },
      include: { movies: true }
    });

    // Validación: Verifica que la saga exista y contenga contenido alquilable
    if (!saga || saga.movies.length === 0) {
      return NextResponse.json({ error: "Esta saga no tiene películas disponibles." }, { status: 400 });
    }

    // Lógica de negocio: Cálculo de la fecha de expiración según el plan elegido
    const expiresAt = new Date();
    if (duracion === "semana") {
      expiresAt.setDate(expiresAt.getDate() + 7);
    } else if (duracion === "mes") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Mapeo de datos: Creamos un registro de alquiler por cada película
    const alquileresData = saga.movies.map(movie => ({
      userId: user.id,
      movieId: movie.id,
      expiresAt: expiresAt,
      rentedAt: new Date() 
    }));

    // Inserción (Bulk Insert): Guarda todos los alquileres en la base de datos en una sola operación
    await prisma.alquileres.createMany({
      data: alquileresData
    });

    // Respuesta de éxito
    return NextResponse.json({ message: "Alquiler procesado con éxito" }, { status: 200 });

  } catch (error) {
    // Manejo de errores
    console.error("Error al alquilar:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}