import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Database } from '@/lib/Database';

export const dynamic = 'force-dynamic';

const prisma = Database.getInstance();

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { email: session.user.email },
      include: {
        submissions: {
          include: { assignment: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // 1. Calculate the new simplified metrics
    // 1. Calculate the actual metrics
    // Total assigned is all assignments in the system (or student.submissions.length if targeted)
    const totalAssigned = await prisma.assignment.count();
    
    // FIX: Only count submissions where the score is > 0 (1 = submitted, 2 = checked)
    const actualSubmissions = student.submissions.filter(sub => sub.score > 0);
    const totalSubmitted = actualSubmissions.length;
    
    const completionRate = totalAssigned > 0 
      ? Math.round((totalSubmitted / totalAssigned) * 100) 
      : 0;

    // 2. Keep the chart data intact for the graph
    const chartData = actualSubmissions
      .filter(sub => sub.score > 1) // Only graph graded items (score == 2)
      .map(sub => ({
        name: sub.assignment.title,
        score: Math.round((sub.score / sub.assignment.maxScore) * 100)
      }));

    return NextResponse.json({
      success: true,
      data: {
        studentName: student.name,
        totalAssigned,
        totalSubmitted,
        completionRate,
        chartData
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}