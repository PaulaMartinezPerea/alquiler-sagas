import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const sagas = await prisma.sagas.findMany({
      include: {
        movies: true, 
      },
    });
    
    return NextResponse.json(sagas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el catálogo" }, { status: 500 });
  }
}