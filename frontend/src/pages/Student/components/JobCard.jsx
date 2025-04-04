import { Link } from "react-router-dom";

const JobCard = ({ job, buttonType }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-purple-600 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-800 mt-1 font-bold text-xl">{job.name}</p>
          <h3 className="text-lg font-bold text-gray-600">{job.title}</h3>
        </div>
        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
          {job.type}
        </span>
      </div>

      <div className="mt-4 flex items-center">
        {/* <svg
          className="w-5 h-5 text-gray-500 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg> */}
        <span className="font-medium text-gray-700">
          Stipend: ₹{job.salary}/month
        </span>
      </div>

      {buttonType === "apply" ? (
        <div className="mt-6 flex justify-end">
          <Link
            to={`/student/apply-job/${job.job_id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Apply
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex justify-end">
          <Link
            to={`/student/application-track/${job.job_id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Track
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobCard;
