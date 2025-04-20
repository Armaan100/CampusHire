import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-4 border border-gray-200">
      <h2 className="text-xl font-bold mb-2 text-purple-800">{job.title}</h2>
      <p className="text-gray-700 mb-2">{job.description}</p>

      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Posted:</span> {formatDate(job.posted_date)}
      </div>
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Deadline:</span> {formatDate(job.deadline)}
      </div>
      <div className="text-sm text-gray-600 mb-4">
        <span className="font-medium">Salary:</span> ₹{job.salary.toLocaleString()}
      </div>

      <button
        onClick={() => navigate(`/company/job/${job.job_id}`)}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        View
      </button>
    </div>
  );
};

export default JobCard;
