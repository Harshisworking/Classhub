'use client';

import { type } from "os";


export interface TestSubmission {
  id: number;
  rawId: number;
  entityType: 'assignment' | 'test';
  studentName: string;
  testName: string;
  dateSubmitted: string;
  status: 'Pending' | 'Graded';
  score: number | null;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  avgScore: number;
  createdAt: string;
  isAdmin: boolean;
}

export interface Assignment {
  id: number;
  title: string;
  type: string;
  inputMode: string;
  maxScore: number;
  fileUrl: string | null;
}

export interface Test {
  id: number;
  title: string;
  format: string;
  maxScore: number;
  fileUrl: string | null;
}

export interface RawSubmissionItem {
  id: number;
  score: number;
  studentFileUrl: string | null;
  studentId: number;
  assignmentId?: number;
  testId?: number;
  createdAt: string;
  student: Student;
  assignment?: Assignment;
  test?: Test;
  isSubmitted:boolean
}

export interface viewAnswersResponse {
  id: number,
  text: string,
  option1: string,
  option2: string,
  option3: string,
  option4: string,
  answer: string,
  ansSelected: string
}

export class TestSubmissionService {
  private readonly baseUrl = '/api/admin/testSubmissions';

  public async viewAnswers(testId:number,): Promise<viewAnswersResponse[]|undefined> {    
    const response= await fetch(`${this.baseUrl}/viewPages/${testId}`,{
      method:'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if(!response.ok){
      return 
    }

    const data = await response.json();

    return data.data;
  }

  public async getSubmissions(): Promise<TestSubmission[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.statusText}`);
      }

      const data = await response.json();
      const rawList: RawSubmissionItem[] = Array.isArray(data) ? data : (data.assignedWork || []);

      return rawList.map((item) => this.mapToUIModel(item));
    } catch (error) {
      console.error("TestSubmissionService.getSubmissions error:", error);
      return [];
    }
  }

  public async updateScore(id: number, score: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      });

      return response.ok;
    } catch (error) {
      console.error("Failed to submit score:", error);
      return false;
    }
  }

  private mapToUIModel(item: RawSubmissionItem): TestSubmission {
    const isAssignment = Boolean(item.assignmentId || item.assignment);
    const entity = isAssignment ? item.assignment : item.test;
    const prefix = isAssignment ? 'assignment' : 'test';

    // Status: If score is greater than 0, mark as Graded
    const isGraded = (item.isSubmitted);

    return {
      id: item.id,
      rawId: item.id,
      entityType: prefix,
      studentName: item.student?.name || 'Unknown Student',
      testName: entity?.title || 'Untitled Test',
      dateSubmitted: new Date(item.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: isGraded ? 'Graded' : 'Pending',
      score: item.score,
    };
  }
}