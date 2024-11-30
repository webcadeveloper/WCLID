import prisma from '@/prisma/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar los datos del operador
    const { username, password, firstName, lastName, email, phone } = body;

    if (!username || !password || !firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Crear el operador
    const newOperator = await prisma.user.create({
      data: {
        username,
        passwordHash: password, // Asegúrate de hashear la contraseña antes de guardar
        role: 'OPERATOR',
        firstName,
        lastName,
        email,
        phone,
      },
    });

    return NextResponse.json(newOperator, { status: 201 });
  } catch (error) {
    console.error('Error creando operador:', error);
    return NextResponse.json({ error: 'No se pudo crear el operador' }, { status: 500 });
  }
}
