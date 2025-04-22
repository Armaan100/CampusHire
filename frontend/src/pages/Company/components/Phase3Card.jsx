import { useState } from "react";
import axios from "axios";

const Phase3Card = ({ student, jobId, onScheduled }) => {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewVenue, setInterviewVenue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!interviewDate || !interviewTime || !interviewVenue) {
      alert("Please fill in all fields.");
      return;
    }

    console.log(interviewDate);
    const interviewDateTime = `${interviewDate} ${interviewTime}`;

    const payload = {
      interview_date_time: interviewDateTime,
      interview_venue: interviewVenue,
      roll_number: student.roll_number,
      job_id: jobId,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/company/schedule-interview",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onScheduled(student.roll_number); 
      console.log(response.data);
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview.");
    }
  };

  return (
    <div className="border-2 border-purple-600 rounded-lg p-4 shadow space-y-2 bg-white">
      <h2 className="text-lg font-semibold">Candidate Details</h2>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Roll Number:</strong> {student.roll_number}</p>
      <p><strong>Phone Number:</strong> {student.phone}</p>

      <form onSubmit={handleSubmit} className="space-y-3 pt-4">
        <div>
          <label className="block font-medium">Interview Date:</label>
          <input
            type="date"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            className="border px-3 py-1 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Interview Time:</label>
          <input
            type="time"
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
            className="border px-3 py-1 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Interview Venue:</label>
          <input
            type="text"
            value={interviewVenue}
            onChange={(e) => setInterviewVenue(e.target.value)}
            className="border px-3 py-1 rounded w-full"
            placeholder="e.g., LP-103"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mt-2"
        >
          Schedule Interview
        </button>
      </form>
    </div>
  );
};

export default Phase3Card;
