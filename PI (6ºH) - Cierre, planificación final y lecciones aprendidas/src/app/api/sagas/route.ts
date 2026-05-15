import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// Manejador para peticiones HTTP GET (Endpoint del catálogo)
export async function GET() {
  try {
    // Consulta a la base de datos: Obtiene todas las sagas y sus películas relacionadas
    const sagas = await prisma.sagas.findMany({
      include: {
        movies: true, 
      },
    });
    
    // Éxito: Devuelve los datos obtenidos
    return NextResponse.json(sagas, { status: 200 });
  } catch (error) {
    // Error: Devuelve un mensaje de error
    return NextResponse.json({ error: "Error al obtener el catálogo" }, { status: 500 });
  }
}