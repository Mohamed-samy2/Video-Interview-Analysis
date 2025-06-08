// src/user/pages/JobDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Button, Spinner } from 'react-bootstrap';
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
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title as="h1">{job.title}</Card.Title>
          <Card.Text><strong>Company:</strong> {job.company}</Card.Text>
          <Card.Text><strong>Description:</strong> {job.description}</Card.Text>
          <Card.Text><strong>Salary:</strong> ${job.salary}</Card.Text>
          <Card.Text><strong>Type:</strong> {job.job_type}</Card.Text>
          <Card.Text><strong>Skills:</strong> {job.skills}</Card.Text>
          <Card.Text><strong>Requirements:</strong> {job.requirements}</Card.Text>
          
          {/* <div className="mb-3">
            <strong>Requirements:</strong>
            <ListGroup variant="flush">
              {job.requirements.map((req, index) => (
                <ListGroup.Item key={index}>{req}</ListGroup.Item>
              ))}
            </ListGroup>
          </div> */}

          <div className="text-center mt-4">
            <Button
              variant="success"
              size="lg"
              onClick={() => navigate(`/apply?jobId=${job.id}`)}
            >
              Apply Now
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JobDetails;