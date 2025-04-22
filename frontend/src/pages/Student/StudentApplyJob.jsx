import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const StudentApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  //redirect to job page once applied
  useEffect(() => {
    if(applied){
      const timer = setTimeout(() => {
        navigate("/student");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [applied, navigate]);

  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/student/get-job-details/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setJob(response.data.job);
        setError(null);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/student/apply-job",
        { job_id: jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplied(true);
    } catch (err) {
      console.error("Error applying for job:", err);
      setError("Failed to apply. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow p-8 max-w-4xl mx-auto">
        {job && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {job.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{job.company_name}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="font-semibold text-gray-700 mb-2">
                  Job Details
                </h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Type:</span> {job.type}
                  </p>
                  <p>
                    <span className="font-medium">Stipend/Salary:</span> ₹
                    {job.salary}/month
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {job.state || "Not specified"}, {job.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-semibold text-gray-700 mb-2">
                Job Description
              </h2>
              <p className="text-gray-600">
                {job.description || "No description provided."}
              </p>
            </div>

            {applied ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                You've successfully applied for this position!
              </div>
            ) : (
              <button
                onClick={handleApply}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Apply
              </button>
            )}
          </div>
        )}
        {applied && (
          <div className="mt-5 text-gray-700 text-xl opacity-0 animate-[fadeInOut_0.8s_ease-in-out_infinite]">
            Redirecting to Job Page ...
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StudentApplyJob;
