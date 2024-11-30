import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validación de entrada
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nombre de usuario y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    // Buscar al usuario por nombre de usuario
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Respuesta exitosa con datos del usuario
    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error en el inicio de sesión:', error.message);
    } else {
      console.error('Error desconocido en el inicio de sesión:', error);
    }
    return NextResponse.json(
      { error: 'Error en el servidor. Por favor, inténtelo más tarde.' },
      { status: 500 }
    );
  }
}
