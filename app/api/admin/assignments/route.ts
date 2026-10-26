import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AdminService } from '../../../services/AdminService';
import { EmailService } from '@/app/services/EmailService';
import { Database } from '@/lib/Database';

export async function POST(req: NextRequest) {
  try {
    const db = Database.getInstance();
    
    // 1. Parse the incoming multipart form data
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const type = (formData.get('type') as 'HOMEWORK' | 'CLASSWORK') || 'HOMEWORK';
    const inputMode = formData.get('inputMode') as 'TEXT' | 'PDF';
    const subjectId = parseInt(formData.get('subjectId') as string, 10);
    const studentId = parseInt(formData.get('studentId') as string, 10); 

    const studentDetails = await db.student.findUnique({
      where: { id: studentId }
    });

    const subjectDetails = await db.subject.findUnique({
      where: { id: subjectId }
    });

    let fileUrl: string | undefined = undefined;
    let textContent: string = "PDF given on platform";

    // 2. Handle Text vs PDF logic
    if (inputMode === 'TEXT') {
      textContent = formData.get('textContent') as string;
    } else if (inputMode === 'PDF') {
      const file = formData.get('file') as File;
      if (!file) throw new Error("No file uploaded");

      // Convert the file to a Node.js buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create the uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      
      // Create a unique filename to prevent overwriting
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Save the file to the local disk
      await fs.writeFile(filePath, buffer);
      
      // Public URL accessible by client
      fileUrl = `/uploads/${fileName}`;
    }

    // 3. Save Assignment using AdminService
    const adminService = new AdminService();
    
    const result = await adminService.createAssignment({
      title,
      type,
      inputMode,
      subjectId,
      studentId, 
      textContent,
      fileUrl,
    });

    // 4. Trigger Email Notification
    if (subjectDetails && studentDetails) {
      const emailClient = new EmailService();
      await emailClient.sendNewAssignedAlert(
        type,
        studentDetails.email,
        textContent,
        subjectDetails.name,
        title
      );
    }

    return NextResponse.json({ success: true, result });

  } catch (error) {
    console.error("Assignment upload error:", error);
    return NextResponse.json({ error: "Failed to process assignment" }, { status: 500 });
  }
}