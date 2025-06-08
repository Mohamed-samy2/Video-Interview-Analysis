// src/user/pages/JobDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { getJobById } from '../../services/api';
import { toast } from 'react-toastify';

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
        console.log('Fetched job details:', response.data);
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
    <Container className="details-container">
      <div className="details-card">
        {/* <Card.Body> */}
          {/* <Card.Title as="h1">{job.title}</Card.Title> */}
          <h1> {job.title} </h1>
          <strong> Company: {job.company}</strong>
          <strong> Description: {job.description}</strong>
          <strong> Salary: {job.salary}</strong>
          <strong> Type: {job.job_type}</strong>
          <strong> Skills: {job.skills}</strong>
          <strong> Requirements: {job.company}</strong>
          <strong> Company: {job.requirements}</strong>

          {/* <Card.Text><strong>Company:</strong> {job.company}</Card.Text>
          <Card.Text><strong>Description:</strong> {job.description}</Card.Text>
          <Card.Text><strong>Salary:</strong> ${job.salary}</Card.Text>
          <Card.Text><strong>Type:</strong> {job.job_type}</Card.Text>
          <Card.Text><strong>Skills:</strong> {job.skills}</Card.Text>
          <Card.Text><strong>Requirements:</strong> {job.requirements}</Card.Text> */}

          <div className="text-center mt-4">
            <Button
              variant="success"
              size="lg"
              onClick={() => navigate(`/apply?jobId=${job.id}`)}
            >
              Apply Now
            </Button>
          </div>

        {/* </Card.Body> */}
      </div>
    </Container>
  );
};

export default JobDetails;