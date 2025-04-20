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
