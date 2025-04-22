import { useState } from "react";
import axios from "axios";

const UploadResume = () => {
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB.");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      setResume(file);
      setSuccess(false);
    } else {
      event.target.value = null;
      setResume(null);
    }
  };

  const handleSubmit = async () => {
    if (!resume) {
      setError("Please select a file before submitting.");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const response = await axios.post(
        "https://campus-hire-backend-457618.an.r.appspot.com/student/upload-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setResume(null);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-[600px] bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Resume Upload</h2>
        
        {success ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">Resume uploaded successfully!</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center mb-4">
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-3"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-gray-600 mb-2">Upload your resume in PDF format</p>
                <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                  Select PDF File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max file size: 10MB</p>
              </div>
            </div>

            {resume && (
              <p className="text-sm text-gray-700 mb-2">Selected file: {resume.name}</p>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={isUploading || !resume}
              className={`w-full py-2 px-4 rounded-md text-white ${
                isUploading || !resume
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Resume"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadResume;