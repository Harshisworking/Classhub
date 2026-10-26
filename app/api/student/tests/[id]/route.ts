import { Database } from "@/lib/Database";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numberId = Number(id);

  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = Database.getInstance();

  // 1. Fetch student ID from session
  const student = await db.student.findUnique({
    where: { email: session.user.email },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // 2. Fetch test & questions
  const testResult = await db.test.findUnique({
    where: { id: numberId },
    include: { questions: true },
  });

  if (!testResult) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 });
  }

  // 3. Fetch student's submission record for this test
  const submission = await db.testSubmission.findUnique({
    where: {
      studentId_testId: {
        studentId: student.id,
        testId: numberId,
      },
    },
  });

  // Format questions array cleanly
  const formattedQuestions = testResult.questions.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    options: [q.option1, q.option2, q.option3, q.option4].filter(
      (opt) => opt !== null && opt !== undefined
    ),
    answer: q.answer, // Exact answer string stored in database
  }));

  // Safely parse studentAnswers string JSON array
  let parsedStudentAnswers: string[] = [];
  if (submission?.studentAnswers) {
    try {
      const parsed = typeof submission.studentAnswers === "string" 
        ? JSON.parse(submission.studentAnswers) 
        : submission.studentAnswers;
      
      // Ensure all array items are cast to strings
      parsedStudentAnswers = Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (err) {
      console.error("Failed to parse studentAnswers JSON:", err);
    }
  }

  return NextResponse.json({
    status: 200,
    data: {
      questions: formattedQuestions,
      maxScore: testResult.maxScore,
      isSubmitted: submission?.isSubmitted ?? false,
      score: submission?.score ?? 0,
      studentAnswers: parsedStudentAnswers,
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const testId = Number(id);
  const body = await request.json();
  const { percentage, ansList } = body;

  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = Database.getInstance();

  const student = await db.student.findUnique({
    where: { email: session.user.email },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const result = await db.testSubmission.upsert({
    where: {
      studentId_testId: {
        studentId: student.id,
        testId: testId,
      },
    },
    update: {
      score: percentage,
      isSubmitted: true,
      studentAnswers: JSON.stringify(ansList),
    },
    create: {
      studentId: student.id,
      testId: testId,
      score: percentage,
      isSubmitted: true,
      studentAnswers: JSON.stringify(ansList),
    },
  });

  if (!result) {
    return NextResponse.json({ error: "something went wrong" }, { status: 500 });
  }

  return NextResponse.json({ status: 201, message: "Test submitted successfully" });
}