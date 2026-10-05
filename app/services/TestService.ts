export interface TestRecord {
  id: string;
  icon: string;
  subject: string;
  course: string;
  testName: string;
  date: string;
  duration: string;
  status: string;
  action1: string;
  action2: string;
  action2Disabled: boolean;
}

export class TestService {
  /**
   * Simulates an asynchronous database call (e.g., a Prisma query).
   * In a full-stack Next.js app, this method would make a fetch() request 
   * to your Next.js API routes, which would then query your PostgreSQL database.
   */
  public async getUpcomingTests(): Promise<TestRecord[]> {
    return new Promise((resolve) => {
      // Simulate a 1-second network/database latency
      setTimeout(() => {
        resolve([
          {
            id: 'test-1',
            icon: '🧮',
            subject: 'Mathematics',
            course: 'Algebra II',
            testName: 'Quarterly Midterm Exam (Units 1-4)',
            date: 'Oct 28, 9:00 AM - 11:00 AM',
            duration: '2 Hours',
            status: 'UPCOMING',
            action1: 'View Study Guide',
            action2: 'Start Test (Closed)',
            action2Disabled: true,
          },
          {
            id: 'test-2',
            icon: '🌍',
            subject: 'History',
            course: 'World History',
            testName: 'French Revolution & Napoleonic Era Quiz',
            date: 'Oct 30, 11:30 AM - 12:15 PM',
            duration: '45 Mins',
            status: 'UPCOMING',
            action1: 'View Key Terms',
            action2: 'Take Test',
            action2Disabled: true,
          },
          {
            id: 'test-3',
            icon: '🧪',
            subject: 'Science',
            course: 'Biology',
            testName: 'Cellular Respiration Lab Final',
            date: 'Nov 1, 2:00 PM - 3:00 PM',
            duration: '1 Hour',
            status: 'UPCOMING',
            action1: 'Review Lab Notes',
            action2: 'View Lab Procedure',
            action2Disabled: false,
          },
          {
            id: 'test-4',
            icon: '📘',
            subject: 'Literature',
            course: 'English Lit',
            testName: "Shakespeare's 'Macbeth' In-Class Essay",
            date: 'Nov 2, 3:30 PM - 5:00 PM',
            duration: '90 Mins',
            status: 'UPCOMING',
            action1: 'View Essay Prompts',
            action2: 'Open Essay Portal',
            action2Disabled: false,
          }
        ]);
      }, 1000);
    });
  }
}