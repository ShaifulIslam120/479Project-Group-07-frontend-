import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')); // logged-in user

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/courses');
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Could not load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Join course
  const joinCourse = async (courseId) => {
    if (!user?._id) {
      Swal.fire('Error', 'User not logged in', 'error');
      return;
    }

    try {
      setJoiningId(courseId);
      const res = await fetch(`http://localhost:4000/courses/${courseId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to join course');

      Swal.fire('Success', data.message, 'success');
      fetchCourses(); // Refresh courses to show updated joined status
    } catch (err) {
      console.error('Error joining course:', err);
      Swal.fire('Error', err.message, 'error');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Courses</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const joined = course.students?.includes(user?._id);
              const isJoining = joiningId === course._id;

              return (
                <div
                  key={course._id}
                  className="bg-white p-6 rounded-lg shadow-md text-gray-800"
                >
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-gray-600 mt-1">Code: {course.courseCode}</p>
                  <p className="mt-3">{course.description}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Joined Students: {course.students?.length || 0}
                  </p>
                  <button
                    className={`mt-4 w-full px-4 py-2 rounded ${
                      joined
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    disabled={joined || isJoining}
                    onClick={() => joinCourse(course._id)}
                  >
                    {joined ? 'Joined' : isJoining ? 'Joining...' : 'Join Course'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
