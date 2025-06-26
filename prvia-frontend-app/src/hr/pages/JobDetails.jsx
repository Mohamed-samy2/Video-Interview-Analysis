// src/hr/pages/JobDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { getJobById } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaBuilding, FaTools } from 'react-icons/fa';
import '../../styles/JobDetails.css'

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hrId } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(id);
        const fetchedJob = response.data;

        // Check if the job belongs to the logged-in HR
        if (fetchedJob.hrId !== parseInt(hrId)) {
          toast.error('Unauthorized access');
          navigate('/hr');
          return;
        }

        setJob(fetchedJob);
      } 
      catch (err) {
        console.error('Error fetching job details:', err);
        // Only set user-facing error for critical issues
        if (err.response?.status === 401 || err.response?.status === 403) {
          const message = err.response?.data?.error || 'Authentication error. Please log in again.';
          setError(message);
          toast.error(message);
        } 
        else {
          // For other errors, log but don't disrupt the user experience
          console.error('Job details not available or other error occurred',err);
          // Set a more user-friendly message
          setError('Job information is currently unavailable.');
          setJob(null)
        }
      }
      finally {
        setLoading(false);
      }
      
    };
    fetchJob();
  }, [id, hrId, navigate]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  // if (error) return <div className="text-danger text-center mt-5">{error}</div>;
  if (!job) return <div className="text-center mt-5">Job not found.</div>;

    return (
      <div className="job-details-container">
           <h1 className="job-title">{job.title}</h1>
          <div className="detail-item"><FaBuilding className="icon" /> <strong>Company:</strong> {job.company}</div>
          <div className="detail-item"><strong>Description:</strong>{job.description}</div>
          <div className="detail-item"><strong>Salary:</strong>{job.salary} EGP</div>
          <div className="detail-item"><strong>Type:</strong>{job.job_type}</div>
          <div className="detail-item" > <FaTools className="icon" />
            <strong>Skills:</strong>
            <ul className="sub-list">
              {job.skills.split(',').map((skill, index) => (
                <li key={index}>{skill.trim()}</li>
              ))}
            </ul>
          </div>
          <div className="detail-item">
              <strong>Requirements:</strong>
              <ul className="sub-list">
                {job.requirements.split(',').map((req, index) => (
                  <li key={index}>{req.trim()}</li>
                ))}
              </ul>
          </div>
          <div className="detail-item">
            <strong>Interview Questions:</strong>
            <ul variant="flush">
              {job.questions.map(q => (
                // <ListGroup.Item key={q.id}>{q.question}</ListGroup.Item>
                 <li key={q.id}>{q.question}</li>
              ))}
            </ul>
    
            <div className="button-wrapper"> 
              <Button variant="primary" className='view-button'
              onClick={() => navigate(`/hr/jobs/${id}/applicants`)}
            >
              View Applicants
            </Button>
            <Button
              variant="success"  className='view-button'
              onClick={() => navigate(`/hr/jobs/${id}/passed-applicants`)}
            >
              View Interviewees
            </Button>
           </div>
  
      </div>
      </div>
    );
    }

  

export default JobDetails;