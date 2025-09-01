import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EnrolledCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/signin'); // Redirect if not student
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://localhost:4000/students/${user._id}/enrolled-courses`);
        if (!res.ok) throw new Error('Failed to fetch enrolled courses');
        const data = await res.json();

        // Optional: Ensure instructorName is present
        const coursesWithInstructor = data.map(course => ({
          ...course,
          instructorName: course.instructorName || "TBA",
          announcementsCount: Array.isArray(course.announcements) ? course.announcements.length : 0,
          assignmentsCount: Array.isArray(course.assignments) ? course.assignments.length : 0
        }));

        setCourses(coursesWithInstructor);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Could not load enrolled courses', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, navigate]);

  if (loading)
    return (
      <div className="relative w-[80%] ml-[20%] min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );

  if (courses.length === 0)
    return (
      <div className="relative w-[80%] ml-[20%] min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-center">You have not enrolled in any courses yet.</p>
      </div>
    );

  return (
    <div className="relative w-[80%] ml-[20%] min-h-screen py-8 px-4 bg-white">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          My Enrolled Courses
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {courses.map((course) => (
            <div
              key={course._id}
              className="card shadow-md border rounded-lg p-6 bg-white hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-xl text-gray-800">{course.title}</h2>
              <p className="text-gray-600 mt-2">{course.description?.slice(0, 100)}...</p>
              <p className="text-gray-500 mt-2">Instructor: {course.instructorName}</p>
              <p className="text-gray-500 mt-1">Announcements: {course.announcementsCount}</p>
              <p className="text-gray-500 mt-1">Assignments: {course.assignmentsCount}</p>

              <button
                onClick={() => navigate(`/course/${course._id}`)}
                className="mt-4 btn btn-primary w-full"
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourse;
