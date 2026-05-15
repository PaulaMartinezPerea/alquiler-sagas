import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

// Endpoint POST: Procesa la autenticación de los usuarios
export async function POST(request: Request) {
  try {
    // Extracción de credenciales
    const body = await request.json();
    const { email, password } = body;

    // Validación: Verifica que se hayan proporcionado ambos campos
    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos por rellenar" }, { status: 400 });
    }

    // Consulta a la base de datos: Busca al usuario con su email
    const user = await prisma.usuarios.findUnique({
      where: { email: email },
    });

    // Manejo de error si el usuario no existe en la base de datos
    if (!user) {
      return NextResponse.json({ error: "No existe ninguna cuenta con este correo" }, { status: 404 });
    }

    // Compara la contraseña introducida con el hash almacenado
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Manejo de error si la contraseña es inválida
    if (!passwordMatch) {
      return NextResponse.json({ error: "La contraseña es incorrecta" }, { status: 401 });
    }

    // Éxito: Devuelve un mensaje de bienvenida y el rol del usuario
    return NextResponse.json(
      { message: "¡Inicio de sesión exitoso!", role: user.role }, 
      { status: 200 }
    );
    
  } catch (error) {
    // Manejo de errores
    console.error(error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}