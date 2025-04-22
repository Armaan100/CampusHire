import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Phase4Card from "./components/Phase4Card";


const CompnayEvaluateInterview = () => {
  const [applications, setApplications] = useState([]);
  const {jobId} = useParams();

  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/company/get-applications-phase4/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setApplications(response.data.applications);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDecision = async (roll_number, decision) => {
    try {
      const evaluateInterviewDetails = {
        roll_number,
        job_id: jobId,
        interview_status: decision,
      }

      const token = localStorage.getItem("token");

      const response = await axios.post("https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/company/evaluate-interview", 
        evaluateInterviewDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      setApplications((prev) =>
        prev.filter((student) => student.roll_number !== roll_number)
      );
    } catch (err) {
      console.error("Error evaluating interview:", err);
    }
  };

  const handleDone = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await axios.post("https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/company/update-job-phase", 
        {
        job_id: jobId,
        phase: "complete",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);

    navigate(`/company/job/complete/${jobId}`);
    } catch (err) {
      console.error("Error updating job phase:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Interview Evaluation</h1>
      {applications.length === 0 ? (
        <p>No applications pending.</p>
      ) : (
        applications.map((student) => (
          <Phase4Card key={student.roll_number} student={student} onDecision={handleDecision} />
        ))
      )}

      <div className="pt-6">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
          onClick={handleDone}
        >
          Done & Proceed to Coding Test
        </button>
      </div>
    </div>
  );
}

export default CompnayEvaluateInterview;