import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) { // Specify NextRequest type for req
  try {
    const { username, email, password, firstName, lastName, role } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error en signup:', error);
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
  }
}