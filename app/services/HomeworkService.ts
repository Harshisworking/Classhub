export interface HomeworkSubmission {
  id: string;
  studentName: string;
  title: string;
  fileName: string;
  studentFileUrl: string; // <--- Changed to match DB exactly
  dateSubmitted: string;
  status: 'Pending' | 'Checked';
}

export class HomeworkService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = '/api/admin/submissions';
  }

  // Fetch actual data from your PostgreSQL backend
  public async getSubmissions(): Promise<HomeworkSubmission[]> {
    try {
      const response = await fetch(this.baseUrl);
      
      if (!response.ok) {
        throw new Error(`Error fetching submissions: ${response.statusText}`);
      }

      const data = await response.json();

      // Map the raw Prisma objects into clean UI objects
      return data.submissions.map((sub: any) => this.mapToUIModel(sub));
    } catch (error) {
      console.error("HomeworkService: getSubmissions failed", error);
      return []; // Return an empty array so the UI doesn't crash
    }
  }

  // Trigger the PATCH request to update the score in PostgreSQL
  public async markSubmissionChecked(id: string): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      return response.ok;
    } catch (error) {
      console.error("HomeworkService: markSubmissionChecked failed", error);
      return false;
    }
  }

  // Encapsulated logic to map the raw database relation into flat UI props
  private mapToUIModel(rawDbRecord: any): HomeworkSubmission {
    const submissionDate = rawDbRecord.assignment?.createdAt || new Date();

    return {
      id: rawDbRecord.id.toString(),
      studentName: rawDbRecord.student?.name || 'Unknown Student',
      title: rawDbRecord.assignment?.title || 'Untitled',
      dateSubmitted: new Date(submissionDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }),
      status: rawDbRecord.score > 1 ? 'Checked' : 'Pending',
      
      fileName: rawDbRecord.studentFileUrl 
        ? rawDbRecord.studentFileUrl.split('/').pop() 
        : 'Text Submission',
        
      studentFileUrl: rawDbRecord.studentFileUrl || '' // <--- Changed to match DB
    };
  }
}