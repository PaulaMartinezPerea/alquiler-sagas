import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// Definimos la función GET, que se ejecutará cuando alguien visite o consulte esta ruta
export async function GET() {
  try {
    // Consulta relacional a la base de datos: le decimos a Prisma: Búscame todos los registros de la tabla sagas
    const sagas = await prisma.sagas.findMany({
      include: {
        movies: true, 
      },
    });
    
    // Devolvemos el paquete de datos completo Sagas + Películas con un código 200, que es que está bien
    return NextResponse.json(sagas, { status: 200 });
  } catch (error) {
    // Si ocurre algún error de conexión, evitamos que la aplicación se rompa y devolvemos un mensaje de error
    return NextResponse.json({ error: "Error al obtener el catálogo" }, { status: 500 });
  }
}
