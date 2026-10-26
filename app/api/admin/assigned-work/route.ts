import { NextResponse } from 'next/server';
import { Database } from '@/lib/Database'; // Adjust path based on your setup

export const dynamic = 'force-dynamic';

const prisma = Database.getInstance();

export async function GET() {
  try {
    // Fetch all submissions to see the history of what was assigned to whom
    const assignedHomeWork = await prisma.submission.findMany({
      include: {
        student: true,     
        assignment: true,  
      },
      orderBy: {
        createdAt: 'desc' // Newest assignments first
      }
    });

    const assignedTestWork = await prisma.testSubmission.findMany({
      include:{
        student: true,
        test: true
      }
    })

    console.log("this is homework>>>>>>>>>",assignedHomeWork)

    const assignedWork = [...assignedHomeWork,...assignedTestWork];
    console.log("this is total with homework and test list>>>>",assignedWork)

    return NextResponse.json({ success: true, assignedWork });
  } catch (error) {
    console.error("Failed to fetch assigned work:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}