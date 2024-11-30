import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Importar el tipo de error
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const caseId = parseInt(params.id, 10);

    if (isNaN(caseId)) {
      return NextResponse.json({ error: 'ID de caso inválido' }, { status: 400 });
    }

    const body = await request.json();

    // Excluir campos no válidos de `data`
    const { id, operator, ...updateData } = body;

    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data: updateData,
    });

    return NextResponse.json(updatedCase, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    console.error('Error actualizando el caso:', error);
    return NextResponse.json({ error: 'Error al actualizar el caso' }, { status: 500 });
  }
}
