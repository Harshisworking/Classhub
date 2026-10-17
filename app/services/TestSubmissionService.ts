import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export interface TestSubmission {
  id: string;
  studentName: string;
  testName: string;
  dateSubmitted: string;
  status: 'Pending' | 'Graded';
  score: number | null;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  password: string;
  avgScore: number;
  createdAt: string;
  isAdmin: boolean;
}

export interface Assignment {
  id: number;
  title: string;
  type: string;
  inputMode: string;
  maxScore: number;
  textContent: string;
  fileUrl: string | null;
  subjectId: number;
  createdAt: string;
}

export interface TestSubmissionDetail {
  id: number;
  score: number;
  studentFileUrl: string | null;
  studentId: number;
  assignmentId: number;
  createdAt: string;
  student: Student;
  assignment: Assignment;
}

export class TestSubmissionService {
  // Simulate fetching data from your backend
  public async getSubmissions(): Promise<TestSubmission[]> {
    const response = await fetch("api/admin/testSubmissions");

    const result = (await response.json()).assignedWork;

    const finalResult = result.map((item: TestSubmissionDetail) => {
      return {
        id: item.id,
        studentName: item.student.name,
        testName: item.assignment.title,
        dateSubmitted: item.createdAt,
        status: 'Pending',
        score: item.score,
      }
    })


    return finalResult
  }

  // Simulate a database mutation to update the score
  public async updateScore(id: string, score: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Return true assuming the DB update succeeded
      }, 500);
    });
  }
}