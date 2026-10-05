import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Database } from '@/lib/Database'; // Ensure this path matches your project structure
import { promises as fs } from 'fs';
import path from 'path';

// Get the pre-configured Prisma client instance through your Singleton class
const prisma = Database.getInstance();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { email: session.user.email }
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const assignmentId = parseInt(formData.get('assignmentId') as string, 10);
    const file = formData.get('file') as File;

    if (!assignmentId || !file) {
      return NextResponse.json({ error: "Assignment ID and file are required" }, { status: 400 });
    }

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/uploads/submissions');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `sub-${student.id}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/submissions/${fileName}`;

    // Update submission record
    const updatedSubmission = await prisma.submission.updateMany({
      where: {
        studentId: student.id,
        assignmentId: assignmentId,
      },
      data: {
        score: 1, // Marks as submitted
        studentFileUrl: fileUrl, // <--- SAVES THE STUDENT'S FILE URL TO THE DB
      },
    });

    return NextResponse.json({ success: true, fileUrl, updatedSubmission });

  } catch (error) {
    console.error("Student submission error:", error);
    return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
  }
}