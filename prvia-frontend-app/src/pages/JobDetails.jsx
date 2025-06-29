// src/pages/JobDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getJobById } from '../services/api';
import { toast } from 'react-toastify';
import { FaBuilding, FaTools } from 'react-icons/fa';
import '../styles/JobDetails.css';

const JobDetails = ({ isHr = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, hrId } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(id);
        const fetchedJob = response.data;

        // For HR, check ownership
        if (isHr && role === 'hr' && fetchedJob.hrId !== parseInt(hrId)) {
          toast.error('Unauthorized access');
          return <Navigate to="/hr" replace />;
        }

        setJob(fetchedJob);
      } catch (err) {
        console.error('Error fetching job details:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Authentication error. Please log in again.');
          toast.error(error);
        } else {
          setError('Job information is currently unavailable.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, isHr, role, hrId, navigate]);

  // Redirect if role doesn't match the expected context
  if (role === 'hr' && !isHr) {
    return <Navigate to={`/hr/jobs/${id}`} replace />;
  }
  if ((role === null || role === undefined) && isHr) {
    return <Navigate to={`/job/${id}`} replace />;
  }

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;
  if (!job) return <div className="text-center mt-5">Job not found.</div>;

  return (
    <div className="job-details-container">
      <h1 className="job-title">{job.title}</h1>
      <div className="detail-item"><FaBuilding className="icon" /> <strong>Company:</strong> {job.company}</div>
      <div className="detail-item"><strong>Description:</strong> {job.description}</div>
      <div className="detail-item"><strong>Salary:</strong> {job.salary} EGP</div>
      <div className="detail-item"><strong>Type:</strong> {job.job_type}</div>
      <div className="detail-item">
        <FaTools className="icon" />
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
      {isHr && role === 'hr' && (
        <div className="detail-item">
          <strong>Interview Questions:</strong>
          <ul>
            {job.questions.map(q => (
              <li key={q.id}>{q.question}</li>
            ))}
          </ul>
          <div className="button-wrapper">
            <Button
              variant="primary"
              className="view-button"
              onClick={() => navigate(`/hr/jobs/${id}/applicants`)}
            >
              View Applicants
            </Button>
            <Button
              variant="success"
              className="view-button"
              onClick={() => navigate(`/hr/jobs/${id}/passed-applicants`)}
            >
              View Interviewees
            </Button>
          </div>
        </div>
      )}
      {(!isHr || role === null) && (
        <div className="button-wrapper">
          <Button
            variant="primary"
            className="apply-button"
            onClick={() => navigate(`/apply?jobId=${job.id}`)}
          >
            Apply Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobDetails;