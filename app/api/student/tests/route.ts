import { Database } from "@/lib/Database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  const db = Database.getInstance();
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentEmail = session.user.email;

  if (!studentEmail) {
    return NextResponse.json({ error: "something went wrong", status: 500 });
  }

  const questionList = await db.testSubmission.findMany({
    where: {
      student: {
        email: studentEmail,
      },
    },
    include: {
      student: true,
      test: true,
    },
  });

  if (!questionList) {
    return NextResponse.json({ error: "something went wrong", status: 500 });
  }

  const now = new Date().getTime();

  const dataList = questionList.map((item) => {
    const durationInMs = item.test.duration * 60 * 1000;
    const startTimeMs = item.startTime ? new Date(item.startTime).getTime() : null;

    let status: "COMPLETED" | "EXPIRED" | "IN_PROGRESS" | "PENDING" = "PENDING";
    let remainingSeconds = item.test.duration * 60;

    if (item.isSubmitted) {
      status = "COMPLETED";
      remainingSeconds = 0;
    } else if (startTimeMs) {
      const elapsedMs = now - startTimeMs;
      const remainingMs = durationInMs - elapsedMs;

      if (remainingMs <= 0) {
        status = "EXPIRED";
        remainingSeconds = 0;
      } else {
        status = "IN_PROGRESS";
        remainingSeconds = Math.floor(remainingMs / 1000);
      }
    }

    return {
      id: item.testId,
      type: item.test.fileUrl ? "PDF" : "MCQ",
      isCompleted: item.isSubmitted,
      title: item.test.title,
      createdAt: item.createdAt,
      totalScore: item.test.maxScore,
      duration: item.test.duration,
      startTime: item.startTime,
      remainingSeconds,
      status,
    };
  });

  return NextResponse.json({
    status: "fetched data successfully",
    data: dataList,
  });
}