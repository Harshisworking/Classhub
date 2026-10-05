export interface TestSubmission {
  id: string;
  studentName: string;
  testName: string;
  dateSubmitted: string;
  status: 'Pending' | 'Graded';
  score: number | null;
}

export class TestSubmissionService {
  // Simulate fetching data from your backend
  public async getSubmissions(): Promise<TestSubmission[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'ts1',
            studentName: 'Zaqi',
            testName: 'French Revolution & Napoleonic Era Quiz',
            dateSubmitted: 'Oct 1, 2026',
            status: 'Pending',
            score: null,
          },
          {
            id: 'ts2',
            studentName: 'Husna',
            testName: 'Cellular Respiration Lab Final',
            dateSubmitted: 'Sep 30, 2026',
            status: 'Graded',
            score: 92,
          },
          {
            id: 'ts3',
            studentName: 'Aayu',
            testName: 'Quarterly Midterm Exam (Units 1-4)',
            dateSubmitted: 'Sep 29, 2026',
            status: 'Pending',
            score: null,
          },
        ]);
      }, 800);
    });
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