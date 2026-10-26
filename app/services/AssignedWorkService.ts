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
      
      // Handle both array response directly or nested assignedWork array
      const rawItems = Array.isArray(data) ? data : (data.assignedWork || []);
      return rawItems.map((item: any) => this.mapToUIModel(item));
    } catch (error) {
      console.error("AssignedWorkService failed:", error);
      return [];
    }
  }

  private mapToUIModel(rawDbRecord: any): AssignedWorkItem {
    const isAssignment = Boolean(rawDbRecord.assignmentId || rawDbRecord.assignment);
    const itemData = isAssignment ? rawDbRecord.assignment : rawDbRecord.test;
    
    // Prefix ID with record type to prevent React key collision across assignments/tests
    const prefix = isAssignment ? 'assignment' : 'test';
    const uniqueId = `${prefix}-${rawDbRecord.id}`;

    return {
      id: uniqueId,
      studentName: rawDbRecord.student?.name || 'Unknown Student',
      type: isAssignment ? 'HOMEWORK' : 'TEST',
      title: itemData?.title || 'Untitled',
      dateAssigned: new Date(rawDbRecord.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
    };
  }
}