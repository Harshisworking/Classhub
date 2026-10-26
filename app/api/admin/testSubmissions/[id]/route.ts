import { NextResponse } from 'next/server';
import { Database } from '@/lib/Database'; // Adjust path based on your setup

const prisma = Database.getInstance();

interface RouteParams {
  params: Promise<{
    id: string; // The ID passed from the frontend (e.g., "assignment-2" or "test-1")
  }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { score } = body;

    // Validate score input
    if (score === undefined || typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'Invalid score provided' },
        { status: 400 }
      );
    }

    // Parse composite key format (e.g., "assignment-2" -> type: "assignment", numericId: 2)
    const [type, rawId] = id.split('-');
    const numericId = parseInt(rawId || id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid submission ID format' },
        { status: 400 }
      );
    }

    let updatedRecord;

    // Conditionally update depending on whether it's an assignment or a test submission
    if (type === 'assignment') {
      updatedRecord = await prisma.testSubmission.update({
        where: { id: numericId },
        data: { score },
      });
    } else if (type === 'test') {
      updatedRecord = await prisma.testSubmission.update({
        where: { id: numericId },
        data: { score },
      });
    } else {
      // Fallback: search default submission table if prefix is absent
      updatedRecord = await prisma.testSubmission.update({
        where: { id: numericId },
        data: { score },
      });
    }

    return NextResponse.json({
      message: 'Score updated successfully',
      data: updatedRecord,
    });
  } catch (error) {
    console.error('PATCH /api/admin/testSubmissions error:', error);
    return NextResponse.json(
      { error: 'Failed to update submission score' },
      { status: 500 }
    );
  }
}