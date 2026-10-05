import { Database } from '../../lib/Database';

export class AuthService {
  private db = Database.getInstance();

  public async authenticateStudent(email: string, passwordInput: string) {
    // Find the student by email
    const student = await this.db.student.findUnique({
      where: { email },
    });

    // If no student is found, or passwords don't match, return null
    if (!student || student.password !== passwordInput) {
      return null;
    }

    // Omit the password from the returned object for security
    const { password, ...studentData } = student;
    return studentData;
  }
}