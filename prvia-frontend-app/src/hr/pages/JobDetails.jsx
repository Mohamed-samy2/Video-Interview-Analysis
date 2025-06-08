// src/hr/pages/JobDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Spinner } from 'react-bootstrap';
import { getJobById } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

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
          console.log('Job details not available or other error occurred',err);
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
     <Container className="details-container">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title as="h1">{job.title}</Card.Title>
          <Card.Text><strong>Company:</strong> {job.company}</Card.Text>
          <Card.Text><strong>Description:</strong> {job.description}</Card.Text>
          <Card.Text><strong>Salary:</strong> ${job.salary}</Card.Text>
          <Card.Text><strong>Type:</strong> {job.job_type}</Card.Text>
          <Card.Text><strong>Skills:</strong> {job.skills}</Card.Text>
          <Card.Text><strong>ٌٌٌRequirements:</strong> {job.requirements}</Card.Text>
          <div className="mb-3">
            <h5>Interview Questions:</h5>
            <ListGroup variant="flush">
              {job.questions.map(q => (
                <ListGroup.Item key={q.id}>{q.question}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <div className="mt-4 d-flex justify-content-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/hr/jobs/${id}/applicants`)}
            >
              View Applicants
            </Button>
            <Button
              variant="success"
              onClick={() => navigate(`/hr/jobs/${id}/passed-applicants`)}
            >
              View Passed Applications
            </Button>
          </div>
        </Card.Body>
      </Card>
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => navigate('/hr')}>
          Back to Home
        </Button>
      </div>
    </Container>
  );
};

export default JobDetails;