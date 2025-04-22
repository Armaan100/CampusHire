import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../../components/Header";
import UploadResume from "./UploadResume";
import Footer from "../../components/Footer";

// import StudentJob from "./StudentJob.jsx";

const StudentPanel = ({children}) => {
  const navigate = useNavigate();
  const [uploadedResume, setUploadedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/student/get-profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        setStudent(response.data.student);
        setUploadedResume(response.data.student.resume || false);

        if (response.status === 200) {
          navigate("/student/jobs"); // Navigate directly to jobs page
        }
      } catch (err) {
        console.error("Error: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  //verification will do later if required

  if (!student) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-700 font-medium">No student data found</p>
          <button
            onClick={() => navigate("/student-login")}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  //check if resume is uploaded or not
  if (!uploadedResume) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50 p-4">
          <UploadResume onUploadSuccess={() => setUploadedResume(true)} />
        </main>
        <Footer />
      </div>
    );
  }

  //take to the student Job and Internship Page
  // return (
  //   <div>
  //     <Header />
  //     <StudentJob />
  //     <Footer />
  //   </div>
  // );

  return <div>{children}</div>;
};

export default StudentPanel;
