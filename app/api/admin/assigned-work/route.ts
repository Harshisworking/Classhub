import { NextResponse } from 'next/server';
import { Database } from '@/lib/Database'; // Adjust path based on your setup

export const dynamic = 'force-dynamic';

const prisma = Database.getInstance();

export async function GET() {
  try {
    // Fetch all submissions to see the history of what was assigned to whom
    const assignedWork = await prisma.submission.findMany({
      include: {
        student: true,     
        assignment: true,  
      },
      orderBy: {
        createdAt: 'desc' // Newest assignments first
      }
    });

    return NextResponse.json({ success: true, assignedWork });
  } catch (error) {
    console.error("Failed to fetch assigned work:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}