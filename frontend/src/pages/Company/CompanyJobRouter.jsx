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
        const response = await axios.get(`https://campus-hire-backend-457618.an.r.appspot.com/company/job-status/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const phase = response.data.job_status;
        console.log(phase);
        
        switch (phase) {
          case 'resume':
            navigate(`/company/job/resume/${jobId}`);
            break;
          case 'coding-test':
            navigate(`/company/job/send-coding-test/${jobId}`);
            break;
          case 'coding-test-evaluation':
            navigate(`/company/job/evaluate-coding-test/${jobId}`);
            break;
          case 'interview-schedule':
            navigate(`/company/job/schedule-interview/${jobId}`);
            break;
          case 'interview-evaluation':
            navigate(`/company/job/evaluate-interview/${jobId}`);
            break;
          case 'complete':
            navigate(`/company/job/get-selected-students/${jobId}`);
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
