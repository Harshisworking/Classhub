export interface SubjectStat {
  subject: string;
  average: number;
  grade: string;
}

export interface PerformanceDataPoint {
  week: string;
  overall: number;
  math: number;
  history: number;
  science: number;
}

export interface StudentFullStats {
  studentId: number;
  name: string;
  overallAverage: number;
  subjects: SubjectStat[];
  chartData: PerformanceDataPoint[];
}

export class StudentStatsService {
  public async getStudentStats(studentId: number): Promise<StudentFullStats> {
    return new Promise((resolve) => {
      // Simulate database fetch delay
      setTimeout(() => {
        resolve({
          studentId,
          name: 'Student Name', // In a real app, you'd fetch the actual name from the DB row
          overallAverage: 88.5,
          subjects: [
            { subject: 'Mathematics', average: 92, grade: 'A' },
            { subject: 'Science', average: 85, grade: 'B+' },
            { subject: 'History', average: 88, grade: 'A-' },
            { subject: 'Literature', average: 89, grade: 'A-' },
          ],
          chartData: [
            { week: 'Week 1', overall: 75, math: 80, history: 70, science: 75 },
            { week: 'Week 2', overall: 78, math: 85, history: 72, science: 78 },
            { week: 'Week 3', overall: 82, math: 88, history: 78, science: 80 },
            { week: 'Week 4', overall: 85, math: 90, history: 82, science: 83 },
            { week: 'Week 5', overall: 84, math: 88, history: 80, science: 85 },
            { week: 'Week 6', overall: 88, math: 92, history: 88, science: 85 },
          ]
        });
      }, 600);
    });
  }
}