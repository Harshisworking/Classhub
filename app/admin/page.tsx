import React from 'react';
import { AdminService } from '../services/AdminService';
import { AdminDashboardClient } from '../components/admin/AdminDashboardClient';

export default async function AdminPage() {
  // 1. Instantiate your OOP service securely on the server
  const adminService = new AdminService();
  
  // // 2. Fetch the data directly from PostgreSQL
  const dbStudents = await adminService.getStudentList();

  // 3. Format it so the Client Component gets exactly what it expects
  const formattedStudents = dbStudents.map((student) => ({
    id: student.id,
    name: student.name,
    stats: {
      avgScore: student.avgScore,
    },
  }));

  const dbSubjects = await adminService.getSubjects();
  console.log(dbSubjects)

  // 4. Render the interactive Client Component and pass it the secure data
  return <AdminDashboardClient subjects={dbSubjects} initialStudents={formattedStudents} />;
}