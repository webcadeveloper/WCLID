import prisma from '@/prisma/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const metrics = await prisma.operatorMetric.findMany({
      include: {
        operator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo métricas:', error);
    return NextResponse.json({ error: 'No se pudieron obtener las métricas' }, { status: 500 });
  }
}
