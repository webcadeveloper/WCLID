import prisma from '@/lib/prisma';

export async function updateCaseStatus(caseId: number, status: 'RESOLVED' | 'CANCELED') {
  if (isNaN(caseId)) {
    throw new Error('Invalid case ID');
  }

  const data: { status: 'RESOLVED' | 'CANCELED'; resolvedAt?: Date } = { status };

  if (status === 'RESOLVED') {
    data.resolvedAt = new Date();
  }

  const updatedCase = await prisma.case.update({
    where: { id: caseId },
    data,
  });

  return updatedCase;
}
