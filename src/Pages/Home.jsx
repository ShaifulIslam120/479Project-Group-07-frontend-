import React from "react";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const email = location.state?.email || "Student";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">
        Welcome, {email}!
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Student Dashboard</h2>
        <ul className="space-y-2">
          <li>📚 View Courses</li>
          <li>📝 Submit Assignments</li>
          <li>📅 Check Timetable</li>
          <li>💬 Chat with Teacher</li>
        </ul>
      </div>
    </div>
  );
}
