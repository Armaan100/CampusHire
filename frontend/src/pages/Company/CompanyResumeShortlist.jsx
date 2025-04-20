import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Phase1Card from "./components/Phase1Card";


const CompanyResumeShortlist = () => {
  const [applications, setApplications] = useState([]);
  const {jobId} = useParams();

  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/company/get-applications/${jobId}`,
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
      const shortlistingDetails = {
        roll_number,
        job_id: jobId,
        resume_status: decision,
      }

      const response = await axios.post("http://localhost:5000/company/shortlist-resume", 
        shortlistingDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);

      setApplications((prev) =>
        prev.filter((student) => student.roll_number !== roll_number)
      );
    } catch (err) {
      console.error("Error shortlisting resume:", err);
    }
  };

  const handleDone = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await axios.post("http://localhost:5000/company/update-job-phase", 
        {
        job_id: jobId,
        phase: "coding-test",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);

    navigate(`/company/job/send-coding-test/${jobId}`);
    } catch (err) {
      console.error("Error updating job phase:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Resume Shortlisting</h1>
      {applications.length === 0 ? (
        <p>No applications pending.</p>
      ) : (
        applications.map((student) => (
          <Phase1Card key={student.roll_number} student={student} onDecision={handleDecision} />
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

export default CompanyResumeShortlist;