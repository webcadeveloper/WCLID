import { updateCaseStatus } from './updateStatus';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const caseId = parseInt(params.id, 10);
    const updatedCase = await updateCaseStatus(caseId, 'CANCELED');
    return NextResponse.json(updatedCase, { status: 200 });
  } catch (error) {
    console.error('Error rechazando caso:', error);
    return NextResponse.json({ error: 'Error al rechazar el caso' }, { status: 500 });
  }
}