import { Database } from '../../lib/Database';

export class AdminService {
  private db = Database.getInstance();

  public async getStudentList() {
    const userData = await this.db.student.findMany({
      where: { isAdmin: false },
    });

    return userData;
  }

  public async getSubjects() {
    try {
      const subjects = await this.db.subject.findMany();
      return subjects;
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      return [];
    }
  }

  public async createTest(data: {
    title: string;
    format: 'PDF' | 'MCQ';
    subjectId: number;
    studentId: number;
    maxScore: number;
    duration: number;
    fileUrl?: string;
    questions?: Array<{
      questionText: string;
      option1: string;
      option2: string;
      option3: string;
      option4: string;
      answer: string;
    }>;
  }) {
    if (data.format === 'PDF' && !data.fileUrl) {
      throw new Error('PDF file URL is required for a PDF test.');
    }

    if (data.format === 'MCQ' && (!data.questions || data.questions.length === 0)) {
      throw new Error('Questions are required for an MCQ test.');
    }

    return await this.db.test.create({
      data: {
        title: data.title,
        format: data.format,
        maxScore: data.maxScore,
        duration: data.duration,
        subjectId: data.subjectId,
        fileUrl: data.format === 'PDF' ? data.fileUrl : null,
        testSubmission: {
          create: {
            studentId: data.studentId,
            score: 0,
          },
        },
        ...(data.format === 'MCQ' && data.questions && {
          questions: {
            create: data.questions.map((q) => ({
              questionText: q.questionText,
              option1: q.option1,
              option2: q.option2,
              option3: q.option3,
              option4: q.option4,
              answer: q.answer,
            })),
          },
        }),
      },
      include: {
        questions: true,
        testSubmission: true,
      },
    });
  }

  public async createAssignment(data: {
    title: string;
    type: 'HOMEWORK' | 'CLASSWORK';
    inputMode: 'TEXT' | 'PDF';
    subjectId: number;
    studentId: number;
    textContent?: string;
    fileUrl?: string;
    maxScore?: number;
  }) {
    try {
      if (data.inputMode === 'TEXT' && !data.textContent) {
        throw new Error("Text content is required.");
      }
      if (data.inputMode === 'PDF' && !data.fileUrl) {
        throw new Error("File URL is required.");
      }

      const assignment = await this.db.assignment.create({
        data: {
          title: data.title,
          type: data.type,
          inputMode: data.inputMode,
          maxScore: data.maxScore ?? 100,
          subjectId: data.subjectId,
          textContent: data.textContent || null,
          fileUrl: data.fileUrl || null,
          submissions: {
            create: {
              studentId: data.studentId,
              score: 0, 
            },
          },
        },
        include: {
          submissions: true,
        },
      });

      return assignment;

    } catch (error) {
      console.error("Failed to create assignment:", error);
      throw new Error("Could not process the assignment.");
    }
  }
}