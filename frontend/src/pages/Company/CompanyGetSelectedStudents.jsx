import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import StudentCard from "./components/StudentCard";

const CompanyGetSelectedStudents = () => {
  const [students, setStudents] = useState([]);
  const {jobId} = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/company/get-selected-students/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setStudents(response.data.students || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-800">
        Selected Students
      </h1>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {students.length === 0 && !error ? (
        <div>
            <p className="text-gray-500 text-center">No students were selected.</p>
            <p className="text-gray-500 text-center">Your Evaluation is completed Successfully</p>
            <p className="text-gray-500 text-center">Thank You</p>
        </div>
      ) : (
        students.map((student) => <StudentCard key={student.roll_number} student={student} />)
      )}
      <p className="text-gray-500 text-center">Your evaluation process is completed successfully</p>
      <p className="text-gray-500 text-center">Thank you for using our platform! We hope you had a great experience.</p>
      <p className="text-gray-500 text-center">If you had any difficulty than please do contact us from the <Link to="/about"><span className="font-bold">about us</span></Link> page.</p>
    </div>
  );
};

export default CompanyGetSelectedStudents;