import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Phase3Card from "./components/Phase3Card";

const CompanyScheduleInterview = () => {
  const [applications, setApplications] = useState([]);
  const {jobId} = useParams();

  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/company/get-applications-phase3/${jobId}`,
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

  const handleScheduleSuccess = async (roll_number, decision) => {  
      setApplications((prev) =>
        prev.filter((student) => student.roll_number !== roll_number)
      );
  };

  const handleDone = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await axios.post("https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/company/update-job-phase", 
        {
        job_id: jobId,
        phase: "interview-evaluation",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);

    navigate(`/company/job/evaluate-interview/${jobId}`);
    } catch (err) {
      console.error("Error updating job phase:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Schedule Interview</h1>
      {applications.length === 0 ? (
        <p>No applications pending.</p>
      ) : (
        applications.map((student) => (
          <Phase3Card 
          key={student.roll_number} 
          student={student}
          jobId={jobId}
          onScheduled={handleScheduleSuccess} />
        ))
      )}

      <div className="pt-6">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
          onClick={handleDone}
        >
          Done & Proceed to Interview List
        </button>
      </div>
    </div>
  );
}

export default CompanyScheduleInterview;

/*
iyat moi eitu korim ki 👇
1) make another Phase3 Job Card -> where fetch student details and will put fields to enter the interview details and schedule
2) once click on done schedule interview respose will be put 
3) then, button to proceed to evaluate interview
*/