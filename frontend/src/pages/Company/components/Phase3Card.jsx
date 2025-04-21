import { useState } from "react";
import axios from "axios";

const Phase3Card = ({ student, jobId }) => {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewVenue, setInterviewVenue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!interviewDate || !interviewTime || !interviewVenue) {
      alert("Please fill in all fields.");
      return;
    }

    const interviewDateTime = `${interviewDate} ${interviewTime}`;

    const payload = {
      interview_date_time: interviewDateTime,
      interview_venue: interviewVenue,
      roll_number: student.roll_number,
      job_id: jobId,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/company/schedule-interview",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Interview scheduled:", response.data);
      alert("Interview scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview.");
    }
  };

  return (
    <div className="border-2 border-blue-600 rounded-lg p-4 shadow space-y-2 bg-white">
      <h2 className="text-lg font-semibold">Candidate Details</h2>
      <p><strong>Coding Username:</strong> <span className="font-bold">{student.coding_username}</span></p>
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
        >
          Schedule Interview
        </button>
      </form>
    </div>
  );
};

export default Phase3Card;
