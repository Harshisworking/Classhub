import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Database } from '../../../../lib/Database'; // Adjust to '@/lib/Database' if you prefer alias paths

// 🚀 FIX: This forces Next.js to bypass the cache and fetch live DB data every time.
// This guarantees the status instantly changes to SUBMITTED or CHECKED!
export const dynamic = 'force-dynamic';

const database = Database.getInstance();

export async function GET() {
  try {
    // 1. Get the currently logged-in student's session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Look up the student's ID based on their login email
    const student = await database.student.findUnique({
      where: { email: session.user.email }
    });

    if (!student) {
      return NextResponse.json({ error: "Student record not found" }, { status: 404 });
    }

    // 3. Fetch ONLY this student's homework submissions
    const myHomework = await database.submission.findMany({
      where: { 
        studentId: student.id,
        assignment: { type: 'HOMEWORK' } // Filter out tests
      },
      include: {
        assignment: {
          include: {
            subject: true // Pulls in the subject name (e.g., "Math")
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Newest homework first
      }
    });

    return NextResponse.json({ success: true, homework: myHomework });

  } catch (error) {
    console.error("Failed to fetch homework:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}