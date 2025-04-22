import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./components/JobCard";

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get("https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/company/get-jobs", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setJobs(response.data.jobs || []);
        }catch(err){
            console.error("Error fetching jobs:", err);
            setError("Failed to load jobs. Please try again.");
            setJobs([]);
        }
    }

    fetchJobs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-800">Posted Jobs</h1>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {jobs.length === 0 && !error ? (
        <p className="text-gray-500 text-center">No jobs posted yet.</p>
      ) : (
        jobs.map((job) => <JobCard key={job.job_id} job={job} />)
      )}
    </div>
  );
};

export default CompanyJobs;
