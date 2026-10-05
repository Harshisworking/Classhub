import { NextResponse, NextRequest } from 'next/server';
import { Database } from '@/lib/Database'; // Adjust path if needed

// 🚀 FIX: This forces Next.js to bypass the cache and fetch live DB data every time
export const dynamic = 'force-dynamic';

const prisma = Database.getInstance();

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      where: {
        score: { gt: 0 }, 
        assignment: { type: 'HOMEWORK' }
      },
      include: {
        student: true,     
        assignment: true,  
      },
      orderBy: {
        id: 'desc' 
      }
    });

    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  // ... keep your existing PATCH function here ...
  try {
    const { id } = await req.json();
    const updatedSubmission = await prisma.submission.update({
      where: { id: Number(id) },
      data: { score: 2 }, 
    });
    return NextResponse.json({ success: true, updatedSubmission });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}