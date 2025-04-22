import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import JobCard from "./components/JobCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const StudentJob = () => {
  const [activeTab, setActiveTab] = useState("internships");
  const [buttonType, setButtonType] = useState("apply");  //apply or applied
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        let endpoint = "";
        if (activeTab === "internships") {
          endpoint = "https://campus-hire-backend-457618.an.r.appspot.com/student/get-internships";
        } else if (activeTab === "full-time") {
          endpoint = "https://campus-hire-backend-457618.an.r.appspot.com/student/get-full-time";
        } else if (activeTab === "applied-internships") {
          endpoint = "https://campus-hire-backend-457618.an.r.appspot.com/student/get-applied-internships";
        } else if (activeTab === "applied-full-time") {
          endpoint = "https://campus-hire-backend-457618.an.r.appspot.com/student/get-applied-full-time";
        }

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);

        setJobs(response.data.jobs || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Job Types</h2>
          <div className="space-y-2">
            <button
              onClick={() => {
                setActiveTab("internships")
                setButtonType("apply")
                }}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "internships"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Internships
            </button>

            <button
              onClick={() => {
                setActiveTab("full-time")
                setButtonType("apply")
              }}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "full-time"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Full Time Jobs
            </button>

            <button
              onClick={() => {
                setActiveTab("applied-internships")
                setButtonType("applied")
                }}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "applied-internships"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Applied Internships
            </button>

            <button
              onClick={() => {
                setActiveTab("applied-full-time")
                setButtonType("applied")
                }}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === "applied-full-time"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Applied Full Time
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {(() => {
              switch (activeTab) {
                case "internships":
                  return "Internship Opportunities";
                case "full-time":
                  return "Full Time Job Opportunities";
                case "applied-internships":
                  return "Applied Internships";
                case "applied-full-time":
                  return "Applied Full Time Jobs";
              }
            })()}
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No{" "}
              {(() => {
              switch (activeTab) {
                case "internships":
                  return "Internship Opportunities ";
                case "full-time":
                  return "Full Time Job Opportunities ";
                case "applied-internships":
                  return "Applied Internships ";
                case "applied-full-time":
                  return "Applied Full Time Jobs ";
              }
            })()}
              found.
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.job_id} job={job} buttonType={buttonType}/>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentJob;
