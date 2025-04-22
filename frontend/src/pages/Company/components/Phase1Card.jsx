import axios from "axios";

const Phase1Card = ({ student, onDecision }) => {
  const resume_destination = student.resume.split("\\")[5];

  const downloadResume = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://campus-hire-backend-457618.an.r.appspot.com/student/download-resume/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Needed for binary file
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="border-2 border-purple-600 rounded-lg p-4 shadow space-y-2 bg-white">
      <h2 className="text-lg font-semibold">Candidate Details</h2>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Roll Number:</strong> {student.roll_number}</p>
      <p><strong>Phone Number:</strong> {student.phone}</p>
      
      <button
        onClick={() => downloadResume(resume_destination)}
        className="text-purple-700 underline"
      >
        Download Resume
      </button>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => onDecision(student.roll_number, "accepted")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
        <button
          onClick={() => onDecision(student.roll_number, "rejected")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default Phase1Card;
