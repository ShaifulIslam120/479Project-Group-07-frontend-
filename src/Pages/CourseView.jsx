import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const CourseView = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:4000/courses/${courseId}`);
        if (!res.ok) throw new Error("Failed to fetch course details");
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Could not load course details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-black">Loading course details...</p>
      </div>
    );

  if (!course)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-black">Course not found</p>
      </div>
    );

  return (
    <div className="relative w-[80%] ml-[20%] min-h-screen bg-white py-8 px-4">
      <div className="container mx-auto max-w-6xl bg-white shadow-2xl rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4 text-black">{course.title}</h1>
        <p className="mb-6 text-black">{course.description}</p>

        {/* Announcements */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-black">Announcements</h2>
          {course.announcements.length === 0 ? (
            <p className="text-black">No announcements yet.</p>
          ) : (
            <ul className="space-y-2">
              {course.announcements.map((a, index) => (
                <li key={index} className="border p-3 rounded-md bg-gray-50">
                  <p className="text-black">{a.text}</p>
                  <p className="text-black text-sm">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Assignments */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-black">Assignments</h2>
          {course.assignments.length === 0 ? (
            <p className="text-black">No assignments yet.</p>
          ) : (
            <ul className="space-y-2">
              {course.assignments.map((a, index) => (
                <li
                  key={index}
                  className="border p-3 rounded-md bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="text-black">Submitted: {a.filename}</p>
                    <p className="text-black text-sm">
                      {a.marks !== null ? `Marks: ${a.marks}` : "Not graded yet"}
                    </p>
                    <p className="text-black text-sm">
                      Submitted At: {new Date(a.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  {a.path && (
                    <a
                      href={`http://localhost:4000/${a.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      View File
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Materials */}
        {course.materials && (
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-black">Course Materials</h2>
            <a
              href={`http://localhost:4000${course.materials}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Download Materials
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;
