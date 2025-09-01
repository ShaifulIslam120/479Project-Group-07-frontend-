import React, { useEffect, useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ManageStudents = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);

  useEffect(() => {
    if (!user || user.role !== 'faculty') {
      navigate('/signin');
    } else {
      fetchFacultyCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch courses of the faculty
  const fetchFacultyCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/courses/faculty/${user._id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch courses');
      }
      const data = await res.json();
      setCourses(data);
      if (data.length > 0) setSelectedCourseId(data[0]._id);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch students of selected course
 const fetchStudentsByCourse = async (courseId) => {
  try {
    setLoading(true);
    const res = await fetch(
      `http://localhost:4000/faculty/${user._id}/courses/${courseId}/students`
    );
    if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch");
    const data = await res.json();
    setStudents(data);
  } catch (err) {
    console.error("fetchStudentsByCourse error:", err);
    Swal.fire("Error", err.message, "error");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (selectedCourseId) {
      fetchStudentsByCourse(selectedCourseId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId]);

  // Remove student from course
  const handleRemove = async (studentId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Remove this student from the course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:4000/faculty/students/${studentId}/${selectedCourseId}`,
          { method: 'DELETE' }
        );

        const data = await res.json();

        if (res.ok) {
          Swal.fire('Removed!', 'Student has been removed.', 'success');
          setStudents(prev => prev.filter(s => s._id !== studentId));
        } else {
          Swal.fire('Error', data.message || 'Failed to remove student', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    }
  };

  if (loading) return <p className="p-4 text-center text-gray-800">Loading...</p>;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 py-8 px-4">
      <div className="card w-full max-w-5xl shadow-2xl bg-white p-6 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Manage Students
        </h2>

        {/* Course Selector */}
        {courses.length > 0 && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">
              Select Course:
            </label>
            <select
              className="w-full border rounded p-2"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Students Table */}
        {students.length === 0 ? (
          <p className="text-center text-gray-800">No students enrolled in this course.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b text-gray-700 font-semibold">Name</th>
                  <th className="px-4 py-2 border-b text-gray-700 font-semibold">Email</th>
                  <th className="px-4 py-2 border-b text-gray-700 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-gray-800">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-800">{student.email}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handleRemove(student._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;
