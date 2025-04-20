import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, set } from "date-fns";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const StudentApplicationTrack = () => {
  const { jobId } = useParams();
  const [activeTab, setActiveTab] = useState("overall-status");
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [codingUserName, setCodingUsername] = useState("");

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/student/get-application-details/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        setApplicationDetails(response.data.applicationDetails);
      } catch (err) {
        setError("Failed to load application details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationDetails();
  }, [jobId]);

  const DateTimeDisplay = ({ dateString }) => {
    const formattedDate = format(new Date(dateString), "MMMM dd, yyyy hh:mm a");
    const parts = formattedDate.split(" ");

    return (
      <>
        <p>Date: {parts.slice(0, 3).join(" ")}</p>
        <p>Time: {parts.slice(3).join(" ")}</p>
      </>
    );
  };

  const renderTabContent = () => {
    if (!applicationDetails) return null;

    switch (activeTab) {
      case "overall-status":
        return (
          <div className="space-y-4">
            <p className="text-lg">
              {applicationDetails.overall_status === "applied"
                ? "APPLIED"
                : applicationDetails.overall_status === "accepted"
                ? "🎉 Congratulations! Your application has been ACCEPTED"
                : "We sorry that you are REJECTED"}
            </p>
          </div>
        );

      case "resume-status":
        return (
          <div className="space-y-4">
            <p className="text-lg">
              {!applicationDetails.resume_status
                ? "We are undergoing through the resume. Will update very soon"
                : applicationDetails.resume_status === "accepted"
                ? "Contratulations! Your resume has been approved"
                : "Sorry your resume has been rejected"}
            </p>
          </div>
        );

      case "coding-test":
        return !applicationDetails.coding_test_completed ? (
          <div className="space-y-4">
            {applicationDetails.coding_test_link ? (
              <div>
                <div className="text-lg">
                  <p>*Instructions. Read it carefully*</p>
                  <p>
                    1. No Cheating during the test as it is monitored thoroughly
                  </p>
                  <p className="font-bold">
                    2. After submitting coding test in the coding platform, MAKE
                    SURE TO CLICK THE 'SUBMIT' HERE
                  </p>
                  <p>
                    3. In ignoring step 2, you will be disqualified for the
                    further rounds
                  </p>
                  <p>Good luck</p>
                  <br></br>
                </div>

                <span className="font-bold text-xl">Test Link:</span>
                <a
                  href={applicationDetails.coding_test_link}
                  className="text-purple-600 text-xl hover:underline ml-2"
                >
                  Click here to take test
                </a>

                <label
                  htmlFor="coding_username"
                  className="block text-xl mt-6 font-medium text-gray-700 mb-1"
                >
                  Hackerrank Username
                </label>
                <input
                  id="coding_username"
                  type="text"
                  placeholder="Enter Hackerrank Username"
                  value={codingUserName}
                  onChange={(e) => setCodingUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />

                <button
                  className="px-4 mt-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  onClick={async () => {
                    try {
                      const endpoint = `http://localhost:5000/student/submit-coding-test`;
                      const payload = {
                        job_id: jobId,
                        coding_username: codingUserName,
                      };
                      const response = await axios.post(endpoint, payload, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                          "Content-Type": "application/json",
                        },
                      });
                      if (response.status === 200) {
                        setIsSubmitted(true);
                      }

                      console.log(isSubmitted);
                    } catch (err) {
                      console.error(err);
                      setErrMessage(
                        err.response?.data?.message ||
                          `Some Error Occurred. Please try again.
                          If still this problem persists, contact us from about us page`
                      );
                    }
                  }}
                >
                  Submit
                </button>

                {isSubmitted && (
                  <div className="bg-green-100 border border-green-600 text-green-700 px-4 py-2 rounded-lg mt-5">
                    <p className="text-lg font-medium">
                      Coding Test Submitted Successfully.
                      Please refresh this page to get the latest status
                    </p>
                  </div>
                )}

                {errMessage && (
                  <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                    <p>{errMessage}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-lg">
                No coding test sent or check your overall status
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-lg">
              You have already submitted the coding test. Check status in status
              tab.
            </p>
          </>
        );

      case "coding-test-status":
        return (
          <div className="space-y-4">
            <p className="text-lg">
              {!applicationDetails.coding_test_status
                ? "You have not taken the coding test yet or kindly Check Your Overall Status"
                : applicationDetails.coding_test_status === "applied"
                ? "We are undergoing through the coding test. Will update very soon"
                : applicationDetails.coding_test_status === "accepted"
                ? "Congratulations! You passed the coding test"
                : "You need to retake the coding test"}
            </p>
          </div>
        );

      case "interview-status":
        return (
          <div className="space-y-4">
            <p className="text-lg">
              {/* {!applicationDetails.interview_scheduled
                ? "Interview not scheduled yet"
                : `Interview scheduled for ${new Date(applicationDetails.interview_date).toLocaleString()}`} */}

              {!applicationDetails.interview_date_time &&
              !applicationDetails.interview_venue ? (
                "Interview not scheduled yet or check your Overall Status"
              ) : (
                <>
                  <DateTimeDisplay
                    dateString={applicationDetails.interview_date_time}
                  />
                  <br />
                  <p>Venue: {applicationDetails.interview_venue}</p>
                </>
              )}

              <br />

              {!applicationDetails.interview_status
                ? null
                : applicationDetails.interview_status === "accepted"
                ? "Congratulations! You have passed the interview! 🎉"
                : "Sorry you are rejected after interview"}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Track your Application
          </h2>
          <div className="space-y-2">
            {[
              "overall-status",
              "resume-status",
              "coding-test",
              "coding-test-status",
              "interview-status",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow p-8 bg-white ml-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {(() => {
              switch (activeTab) {
                case "overall-status":
                  return "Overall Status";
                case "resume-status":
                  return "Resume Status";
                case "coding-test":
                  return "Coding Test";
                case "coding-test-status":
                  return "Coding Test Status";
                case "interview-status":
                  return "Interview Status";
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
          ) : (
            renderTabContent()
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StudentApplicationTrack;
