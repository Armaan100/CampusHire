import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompanyJobRouter = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPhase = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/company/job-status/${jobId}`);
        const phase = res.data.phase;

        switch (phase) {
          case 'resume':
            navigate(`/company/job/${jobId}/resume`);
            break;
          case 'codingTestForm':
            navigate(`/company/job/${jobId}/send-coding-test`);
            break;
          case 'codingTest':
            navigate(`/company/job/${jobId}/evaluate-coding-test`);
            break;
          case 'interviewForm':
            navigate(`/company/job/${jobId}/schedule-interview`);
            break;
          case 'interview':
            navigate(`/company/job/${jobId}/evaluate-interview`);
            break;
          default:
            alert('Invalid phase or something went wrong!');
        }
      } catch (err) {
        alert('Error checking phase');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkPhase();
  }, [jobId, navigate]);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return null;
};

export default CompanyJobRouter;
