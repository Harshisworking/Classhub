import { Database } from "@/lib/Database";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string; // The ID passed from the frontend (e.g., "assignment-2" or "test-1")
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const numberId = parseInt(id);
  const db = Database.getInstance();

  const ansList = await db.testSubmission.findUnique({
    where: {
      id: numberId
    },
    include: {
      test: {
        include: {
          questions: true
        }
      }
    }
  });

  if (ansList?.studentAnswers == null || ansList.studentAnswers == undefined) {
    return NextResponse.json({ error: "Can't fetch the student ans list" }, { status: 500 });
  }

  const studentAns = JSON.parse(ansList.studentAnswers);
  let count = 0;

  const parsedResponse = ansList.test.questions.map((item) => {
    return {
      id: item.id,
      text: item.questionText,
      option1: item.option1,
      option2: item.option2,
      option3: item.option3,
      option4: item.option4,
      answer: item.answer,
      ansSelected: studentAns[count++]
    };
  });

  return NextResponse.json({ status: "ok", data: parsedResponse });
}