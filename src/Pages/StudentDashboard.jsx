import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  // Dummy data for student
  const courses = [
    { id: 1, title: 'Mathematics', instructor: 'Dr. Smith', progress: '80%' },
    { id: 2, title: 'Physics', instructor: 'Prof. Johnson', progress: '60%' },
    { id: 3, title: 'History', instructor: 'Dr. Brown', progress: '90%' },
  ];

  const assignments = [
    { id: 1, title: 'Math Assignment 1', due: '2025-08-25', status: 'Submitted' },
    { id: 2, title: 'Physics Lab Report', due: '2025-08-27', status: 'Pending' },
    { id: 3, title: 'History Essay', due: '2025-08-30', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-end">
      <div className="w-4/5 p-8 text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-error">Logout</button>
        </div>

        <p className="mb-4">Welcome, <strong>{user?.firstName} {user?.lastName}</strong>!</p>
        <p className="mb-8">Your role: <strong>{user?.role}</strong></p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="p-4 bg-white rounded-lg shadow text-gray-800">
                <h3 className="font-bold text-lg">{course.title}</h3>
                <p>Instructor: {course.instructor}</p>
                <p>Progress: {course.progress}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
          <table className="w-full table-auto bg-white rounded-lg shadow text-gray-800">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(assign => (
                <tr key={assign.id} className="text-center border-t text-gray-800">
                  <td className="px-4 py-2">{assign.title}</td>
                  <td className="px-4 py-2">{assign.due}</td>
                  <td className="px-4 py-2">{assign.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
