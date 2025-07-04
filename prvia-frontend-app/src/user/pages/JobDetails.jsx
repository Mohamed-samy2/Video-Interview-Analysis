// src/user/pages/JobDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {  Button, Spinner } from 'react-bootstrap';
import { getJobById } from '../../services/api';
import { toast } from 'react-toastify';
import { FaBuilding, FaTools } from 'react-icons/fa';
import '../../styles/JobDetails.css'

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect HR users to their job details page
  useEffect(() => {
    if (isLoggedIn && role === 'hr') {
      navigate(`/hr/jobs/${id}`, { replace: true });
    }
  }, [isLoggedIn, role, id, navigate]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(id);
        setJob(response.data);
        setJob(response.data);
      } 
      catch (err) {
        const message = err.response?.data?.error || 'Failed to fetch job details. Please try again.';
        setError(message);
        toast.error(message);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;
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
  
          <div className="button-wrapper"> 
            <Button variant="primary" className="apply-button"
              onClick={() => navigate(`/apply?jobId=${job.id}`)}>
              Apply Now
            </Button>
         </div>

    </div>
  );
};

export default JobDetails;