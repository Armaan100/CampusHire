import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const CompanySendCodingTest = () => {
  const [link, setLink] = useState("");
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/company/send-coding-test",
        { job_id: jobId, 
          coding_test_link: link 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setSuccess(true);
      setError(null);
      
      const response2 = await axios.post("http://localhost:5000/company/update-job-phase",
        {
          job_id: jobId,
          phase: "coding-test-evaluation",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response2.data);

      setTimeout(() => {
        navigate(`/company/job/evaluate-coding-test/${jobId}`);
      }, 2000);
    } catch (err) {
      console.error("Error sending coding test link", err);
      setError("Failed to send the coding test link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Send Coding Test</h1>
          <p className="text-gray-600 mb-6">
            Enter the link to the coding test platform you want to send to the shortlisted candidates.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Coding test link sent successfully! Redirecting...
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label htmlFor="coding-test-link" className="block text-gray-700 font-medium mb-2">
                  Coding Test Link
                </label>
                <input
                  id="coding-test-link"
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Enter link here"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              <button
                onClick={handleSend}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Send Test Link
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


export default CompanySendCodingTest;