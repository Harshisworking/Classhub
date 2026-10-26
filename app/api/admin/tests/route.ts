import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AdminService } from '../../../services/AdminService';
import { EmailService } from '@/app/services/EmailService';
import { Database } from '@/lib/Database';

export async function POST(req: NextRequest) {
  try {
    const db = Database.getInstance();
    const contentType = req.headers.get('content-type') || '';

    let title: string;
    let format: 'MCQ' | 'PDF';
    let subjectId: number;
    let studentId: number;
    let maxScore: number = 100;
    let duration: number = 30;
    let fileUrl: string | undefined = undefined;
    let questions: any[] | undefined = undefined;

    if (contentType.includes('application/json')) {
      const body = await req.json();

      title = body.title;
      format = 'MCQ';
      subjectId = Number(body.subjectId);
      studentId = Number(body.studentId);
      maxScore = Number(body.maxScore) || 100;
      duration = Number(body.duration) || 30;
      questions = body.questions;
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();

      title = formData.get('title') as string;
      format = 'PDF';
      subjectId = parseInt(formData.get('subjectId') as string, 10);
      studentId = parseInt(formData.get('studentId') as string, 10);
      maxScore = parseInt(formData.get('maxScore') as string, 10) || 100;
      duration = parseInt(formData.get('duration') as string, 10) || 30;

      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public/uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);
      fileUrl = `/uploads/${fileName}`;
    } else {
      return NextResponse.json(
        { error: 'Unsupported Content-Type header' },
        { status: 415 }
      );
    }

    const studentDetails = await db.student.findUnique({
      where: { id: studentId },
    });

    const subjectDetails = await db.subject.findUnique({
      where: { id: subjectId },
    });

    const adminService = new AdminService();

    const result = await adminService.createTest({
      title,
      format,
      subjectId,
      studentId,
      maxScore,
      duration,
      fileUrl,
      questions,
    });

    if (subjectDetails && studentDetails) {
      const emailClient = new EmailService();
      const notificationText = format === 'PDF' ? 'PDF Test document uploaded' : 'Interactive MCQ Test assigned';
      
      await emailClient.sendNewAssignedAlert(
        'TEST',
        studentDetails.email,
        notificationText,
        subjectDetails.name,
        title
      );
    }

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error('Test creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process test creation' },
      { status: 500 }
    );
  }
}