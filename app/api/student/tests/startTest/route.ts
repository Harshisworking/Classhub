import { Database } from "@/lib/Database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const db = Database.getInstance();
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { testId } = await req.json();

    const student = await db.student.findUnique({
      where: { email: session.user.email },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const existingSubmission = await db.testSubmission.findFirst({
      where: {
        testId: Number(testId),
        studentId: student.id,
      },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: "Test submission record not found" }, { status: 404 });
    }

    // Only set startTime if it has not been recorded yet
    if (!existingSubmission.startTime) {
      await db.testSubmission.update({
        where: { id: existingSubmission.id },
        data: { startTime: new Date() },
      });
    }

    return NextResponse.json({ message: "Test started timing successfully" });
  } catch (error) {
    console.error("Error starting test:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}