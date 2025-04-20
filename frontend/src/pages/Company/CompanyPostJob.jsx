import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const PostJob = () => {
  const navigate = useNavigate();

  // State for the form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eligibilityCgpa, setEligibilityCgpa] = useState("");
  const [eligibilityYear, setEligibilityYear] = useState("");
  const [jobType, setJobType] = useState("Internship");
  const [deadline, setDeadline] = useState("");
  const [salary, setSalary] = useState("");

  const [message, setMessage] = useState(""); // To store success or error messages
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Reset message

    const jobDetails = {
      title,
      description,
      eligibility_cgpa: eligibilityCgpa,
      eligibility_year: eligibilityYear,
      type: jobType,
      deadline,
      salary,
    };

    console.log(jobDetails);

    try {
      const response = await axios.post(
        "http://localhost:5000/company/post-job",
        jobDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data)
      if (response.status === 200) {
        setMessage("Job submitted successfully!");
      }
    } catch (err) {
      setMessage("Error posting job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
              <p className="mt-2 text-gray-600">Fill the details below</p>
            </div>

            {/* Success/Error Message */}
            {message && (
              <div className={`mb-6 p-4 ${message.includes("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded-lg border`}>
                <p>{message}</p>
              </div>
            )}

            {/* Job Post Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Job Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  id="description"
                  placeholder="Job Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="eligibilityCgpa" className="block text-sm font-medium text-gray-700 mb-1">
                  Eligibility CGPA
                </label>
                <input
                  id="eligibilityCgpa"
                  type="number"
                  step="0.1"
                  placeholder="Eligibility CGPA"
                  value={eligibilityCgpa}
                  onChange={(e) => setEligibilityCgpa(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="eligibilityYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Eligibility Year
                </label>
                <input
                  id="eligibilityYear"
                  type="number"
                  placeholder="Eligibility Year"
                  value={eligibilityYear}
                  onChange={(e) => setEligibilityYear(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  id="type"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary (₹)
                </label>
                <input
                  id="salary"
                  type="number"
                  placeholder="Salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Post Job"
                  )}
                </button>
              </div>
            </form>

            {/* Go Back Button */}
            {message && !message.includes("Error") && (
              <div className="mt-4">
                <p className="text-sm text-green-400 mb-2">{message}</p>
                <button
                  onClick={() => navigate("/company/home")}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                >
                  Go Back to Company Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostJob;
