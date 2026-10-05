export interface AssignedWorkItem {
  id: string;
  studentName: string;
  type: 'HOMEWORK' | 'TEST';
  title: string;
  dateAssigned: string;
}

export class AssignedWorkService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = '/api/admin/assigned-work';
  }

  public async getAssignedWork(): Promise<AssignedWorkItem[]> {
    try {
      const response = await fetch(this.baseUrl);
      
      if (!response.ok) {
        throw new Error(`Error fetching assigned work: ${response.statusText}`);
      }

      const data = await response.json();
      return data.assignedWork.map((item: any) => this.mapToUIModel(item));
    } catch (error) {
      console.error("AssignedWorkService failed:", error);
      return [];
    }
  }

  private mapToUIModel(rawDbRecord: any): AssignedWorkItem {
    return {
      id: rawDbRecord.id.toString(),
      studentName: rawDbRecord.student?.name || 'Unknown Student',
      type: rawDbRecord.assignment?.type || 'HOMEWORK',
      title: rawDbRecord.assignment?.title || 'Untitled',
      // Format to match "Oct 1, 2026"
      dateAssigned: new Date(rawDbRecord.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
    };
  }
}