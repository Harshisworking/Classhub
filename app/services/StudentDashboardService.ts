import { PerformanceDataPoint } from '../components/PerformanceChart';

export interface DashboardMetrics {
  studentName: string;
  totalAssigned: number;
  totalSubmitted: number;
  completionRate: number;
  chartData: PerformanceDataPoint[];
}

export class StudentDashboardService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = '/api/student/dashboard';
  }

  public async getDashboardMetrics(): Promise<DashboardMetrics | null> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      
      const result = await response.json();
      if (!result.success) return null;

      return this.mapToUIModel(result.data);
    } catch (error) {
      console.error("StudentDashboardService Error:", error);
      return null;
    }
  }

  private mapToUIModel(data: any): DashboardMetrics {
    return {
      studentName: data.studentName || 'Student',
      totalAssigned: data.totalAssigned || 0,
      totalSubmitted: data.totalSubmitted || 0,
      completionRate: data.completionRate || 0,
      chartData: data.chartData || [],
    };
  }
}