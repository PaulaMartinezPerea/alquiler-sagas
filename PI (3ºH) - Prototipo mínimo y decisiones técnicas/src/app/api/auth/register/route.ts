import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // AQUÍ ESTÁ EL CAMBIO: prisma.usuarios.create
    const newUser = await prisma.usuarios.create({
      data: {
        email: email,
        password: hashedPassword, 
        role: "CLIENT", 
      },
    });

    return NextResponse.json({ message: "Usuario creado con éxito", user: newUser.email }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear usuario o el email ya existe" }, { status: 500 });
  }
}