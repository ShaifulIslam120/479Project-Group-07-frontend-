import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set the PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

// Use environment variable for API URL
const API_URL = 'http://localhost:4000';

const CourseDetails = ({ course }) => {
  const { id } = useParams(); // Get course ID from URL
  const [pdfBlob, setPdfBlob] = useState(null); // Store PDF blob for reuse
  const [pdfUrl, setPdfUrl] = useState(null); // URL for PDF preview
  const [numPages, setNumPages] = useState(null); // Total number of PDF pages
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching
  const [downloadLoading, setDownloadLoading] = useState(false); // Loading state for downloading

  // Fallback course data if no prop is provided
  const courseData = course || {
    _id: id || null,
    title: 'Sample Course',
    description: 'This is a sample course description.',
    materials: null,
    createdAt: new Date().toISOString(),
  };

  // Fetch PDF when courseData._id or courseData.materials changes
  useEffect(() => {
    if (courseData.materials && courseData._id) {
      const fetchPDF = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/courses/${courseData._id}/materials`);
          if (!response.ok) {
            if (response.status === 429) {
              throw new Error('Too many requests, please try again later');
            }
            if (response.status === 400) {
              throw new Error('Invalid course ID');
            }
            if (response.status === 404) {
              throw new Error('Course or materials not found');
            }
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
          }
          const blob = await response.blob();
          if (blob.type !== 'application/pdf') {
            throw new Error('Invalid file type received');
          }
          setPdfBlob(blob);
          setPdfUrl(window.URL.createObjectURL(blob));
        } catch (err) {
          toast.error(`Error fetching PDF: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPDF();

      // Cleanup temporary URL
      return () => {
        if (pdfUrl) {
          window.URL.revokeObjectURL(pdfUrl);
        }
      };
    } else {
      toast.warn('No course materials or invalid course ID');
    }
  }, [courseData._id, courseData.materials]);

  // Handle successful PDF load
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Handle PDF download
  const handleDownload = async () => {
    if (!pdfBlob) {
      toast.error('No materials available for download');
      return;
    }
    setDownloadLoading(true);
    try {
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = courseData.materials.filename || 'course_materials.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Error downloading PDF');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back link to dashboard */}
      <Link to="/faculty/dashboard" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back
      </Link>
      <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
        {/* Course details */}
        <h1 className="text-2xl font-bold mb-3">{courseData.title}</h1>
        <p className="mb-3 text-gray-700">{courseData.description}</p>
        <p className="text-gray-500 text-sm mb-4">
          Created at: {new Date(courseData.createdAt).toLocaleString()}
        </p>

        {/* Materials section */}
        {courseData.materials ? (
          <div className="space-y-4">
            {/* Download button */}
            <button
              onClick={handleDownload}
              disabled={isLoading || downloadLoading}
              className="text-blue-500 hover:underline mb-3 inline-block disabled:opacity-50"
            >
              {downloadLoading
                ? 'Downloading...'
                : `Download Materials (${courseData.materials.filename || 'course_materials.pdf'})`}
            </button>

            {/* PDF preview */}
            {pdfUrl && !isLoading ? (
              <div className="border rounded-lg p-4 bg-white">
                <h2 className="text-lg font-semibold mb-2">PDF Preview</h2>
                <div className="w-full max-w-[600px] mx-auto">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => {
                      toast.error('Failed to load PDF preview');
                    }}
                    noData={<p>No PDF data available</p>}
                    error={<p>Error loading PDF</p>}
                  >
                    <Page
                      pageNumber={currentPage}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={Math.min(600, window.innerWidth - 40)}
                    />
                  </Document>
                </div>
                {numPages && (
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <p className="text-gray-500 text-sm">
                      Page {currentPage} of {numPages}
                    </p>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages))}
                      disabled={currentPage === numPages}
                      className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">{isLoading ? 'Loading PDF...' : 'No PDF preview available'}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No materials available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;