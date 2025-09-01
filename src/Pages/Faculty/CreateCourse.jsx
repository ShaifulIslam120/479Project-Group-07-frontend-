import React, { useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== 'faculty') {
    return <div className="text-red-600 text-center py-10">You are not authorized to create courses.</div>;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      e.target.value = '';
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      e.target.value = '';
      return;
    }
    setMaterials(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('User not logged in');

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('courseCode', courseCode);
    formData.append('description', description);
    formData.append('facultyId', user._id);
    if (materials) formData.append('materials', materials);

    try {
      const response = await fetch('http://localhost:4000/courses', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setTitle('');
        setCourseCode('');
        setDescription('');
        setMaterials(null);
        fileInputRef.current.value = '';
      } else {
        toast.error(data.message || 'Error creating course');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="w-4/5 md:w-3/5 bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Course</h1>

        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Course Code</label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course code"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course description"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Upload Materials (PDF, optional)</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="w-full text-gray-700"
          />
          {materials && <p className="text-gray-600 mt-1">Selected file: {materials.name}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isLoading ? 'Creating...' : 'Create Course'}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default CreateCourse;
