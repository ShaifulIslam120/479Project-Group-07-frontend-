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
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-8 px-4">
      <div className="w-full max-w-7xl h-full p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Faculty Dashboard
          </h1>
          <Link
            to="/create-course"
            className="btn btn-primary text-white w-full sm:w-auto text-center"
          >
            + Create New Course
          </Link>
        </div>

        {/* Courses */}
        {courses.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">No courses created yet.</p>
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
