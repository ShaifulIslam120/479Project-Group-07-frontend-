import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch course + announcements
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const res = await fetch(`http://localhost:4000/courses/${courseId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch course");
        }
        const data = await res.json();
        setCourse(data);
        setAnnouncements(data.announcements || []);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Submit new announcement
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) {
      toast.error("Please enter an announcement");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:4000/courses/${courseId}/announcement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: announcement.trim() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to post announcement");

      // Add the new announcement returned from backend to the top of the list
      setAnnouncements([data.announcement, ...announcements]);

      setAnnouncement(""); // clear input
      toast.success("Announcement posted!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!course) return <p className="text-center mt-10 text-red-500">Course not found</p>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto p-6">
        {/* Course Title & Date */}
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <p className="text-gray-600 text-sm mt-1">
          Created on: {new Date(course.createdAt).toLocaleDateString()}
        </p>

        {/* Post Announcement */}
        <form
          onSubmit={handleAnnouncementSubmit}
          className="mb-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <label className="block text-gray-700 font-medium mb-2">
            Post an Announcement
          </label>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Write something..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            rows="3"
            aria-label="Announcement text"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Submit"}
          </button>
        </form>

        {/* Announcements List */}
        <div className="space-y-3">
          {announcements.length === 0 ? (
            <p className="italic text-gray-500">No announcements yet.</p>
          ) : (
            announcements.map((a, idx) => (
              <div
                key={idx}
                className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded shadow"
              >
                <p className="font-medium">{a.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <Link to="/faculty/dashboard" className="text-blue-500 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
