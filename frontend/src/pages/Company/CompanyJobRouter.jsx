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
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/company/job-status/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const phase = response.data.job_status;

        switch (phase) {
          case 'resume':
            navigate(`/company/job/resume/${jobId}`);
            break;
          case 'coding-test':
            navigate(`/company/job/${jobId}/send-coding-test`);
            break;
          case 'coding-test-evaluation':
            navigate(`/company/job/${jobId}/evaluate-coding-test`);
            break;
          case 'interview-schedule':
            navigate(`/company/job/${jobId}/schedule-interview`);
            break;
          case 'interview-evaluation':
            navigate(`/company/job/${jobId}/evaluate-interview`);
            break;
          case 'complete':
            navigate(`/company/job/${jobId}/complete`);
            break;
          default:
            alert('Invalid phase or something went wrong!');
        }
      } catch (err) {
        alert('Error while checking phase');
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
