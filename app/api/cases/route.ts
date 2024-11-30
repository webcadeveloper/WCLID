import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Manejador para obtener todos los casos
export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      include: {
        operator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(cases, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los casos:', error);
    return NextResponse.json(
      { error: 'Error al recuperar los casos' },
      { status: 500 }
    );
  }
}
