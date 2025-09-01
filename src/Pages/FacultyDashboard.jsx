import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchCourses = async () => {
    if (!user?._id) return;

    try {
      const res = await fetch(`http://localhost:4000/courses/faculty/${user._id}`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-base-200 to-base-300 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-7xl h-full overflow-y-auto p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-gray-900">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Faculty Dashboard</h1>
          <Link
            to="/create-course"
            className="bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            + Create New Course
          </Link>
        </div>

        {/* Courses */}
        {courses.length === 0 ? (
          <p className="text-gray-600 text-lg">No courses created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link key={course._id} to={`/courses/${course._id}`}>
                <div className="p-5 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                    {course.title}
                  </h2>
                  <p className="text-blue-600 font-medium mb-3">
                    Code: {course.courseCode}
                  </p>
                  <p className="text-gray-700 mb-3 line-clamp-3">{course.description}</p>
                  <p className="text-gray-500 text-sm">
                    Created at: {new Date(course.createdAt).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
