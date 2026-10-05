import { Database } from '../../lib/Database';


export class AdminService {
    private db = Database.getInstance();

    public async getStudentList(){
        const userData  = await this.db.student.findMany({
            where:{isAdmin:false}
        })

        return userData;
    }

    // Add this method to your existing AdminService class
  public async getSubjects() {
    try {
      const subjects = await this.db.subject.findMany();
      return subjects;
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      return [];
    }
  }

  public async createAssignment(data: {
    title: string;
    type: 'TEST' | 'HOMEWORK';
    inputMode: 'TEXT' | 'PDF';
    subjectId: number;
    studentId: number;
    textContent?: string;
    fileUrl?: string;
  }) {
    try {
      if (data.inputMode === 'TEXT' && !data.textContent) throw new Error("Text content is required.");
      if (data.inputMode === 'PDF' && !data.fileUrl) throw new Error("File URL is required.");

      // Natively create the assignment and submission in one single, fast SQL query
      const assignment = await this.db.assignment.create({
        data: {
          title: data.title,
          type: data.type,
          inputMode: data.inputMode,
          subjectId: data.subjectId,
          textContent: data.textContent || null,
          fileUrl: data.fileUrl || null,
          submissions: {
            create: {
              studentId: data.studentId,
              score: 0, 
            }
          }
        }
      });

      return assignment;
      
    } catch (error) {
      console.error("Failed to create assignment:", error);
      throw new Error("Could not process the assignment.");
    }
  }

}