import axios from "axios";

const Phase2Card = ({ student, onDecision }) => {
  return (
    <div className="border-2 border-purple-600 rounded-lg p-4 shadow space-y-2 bg-white">
      <h2 className="text-lg font-semibold">Candidate Details</h2>
      <p><strong>Coding Username: </strong> <span className="font-bold">{student.coding_username}</span></p>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Roll Number:</strong> {student.roll_number}</p>
      <p><strong>Phone Number:</strong> {student.phone}</p>

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

export default Phase2Card;
