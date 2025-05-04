import React from "react";
import { useNavigate } from "react-router-dom";

const StudentCard = ({ student }) => {

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-4 border border-gray-200">
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Roll Number:</span> {student.roll_number}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Name:</span> {student.name}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Email:</span> {student.email}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Phone Number:</span> {student.phone}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Branch:</span> {student.branch}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Semester:</span> {student.semester}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Location:</span> {student.city}, {student.state}
      </div>
    </div>
  );
};

export default StudentCard;
