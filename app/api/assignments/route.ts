import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AdminService } from '../../services/AdminService';

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the incoming multipart form data
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'TEST' | 'HOMEWORK';
    const inputMode = formData.get('inputMode') as 'TEXT' | 'PDF';
    const subjectId = parseInt(formData.get('subjectId') as string, 10);
    const studentId = parseInt(formData.get('studentId') as string, 10); 

    let fileUrl: string | undefined = undefined;
    let textContent: string | undefined = undefined;

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
      
      // The public URL that the browser can use to download it
      fileUrl = `/uploads/${fileName}`;
    }

    // 3. Instantiate your OOP Service and save to DB
    const adminService = new AdminService();
    
    // Pass ALL required properties, including studentId
    const result = await adminService.createAssignment({
      title,
      type,
      inputMode,
      subjectId,
      studentId, 
      textContent,
      fileUrl,
    });

    return NextResponse.json({ success: true, result });

  } catch (error) {
    console.error("Assignment upload error:", error);
    return NextResponse.json({ error: "Failed to process assignment" }, { status: 500 });
  }
}