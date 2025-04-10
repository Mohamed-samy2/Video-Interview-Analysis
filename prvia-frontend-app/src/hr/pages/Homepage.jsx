// src/hr/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { getJobs } from '../../services/api';
import { toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();
  const { hrId } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs(hrId);
        setJobs(response.data);
      } catch (err) {
        const message = err.response?.data?.error || 'Failed to fetch jobs. Please try again.';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    if (hrId) {
      fetchJobs();
    } else {
      setLoading(false);
      setError('Please log in to view your jobs.');
      toast.error('Please log in to view your jobs.');
    }
  }, [hrId]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Your Jobs</h1>
        <Button
          variant="success"
          onClick={() => navigate('/hr/jobs/new')}
        >
          Create New Job
        </Button>
      </div>
      {jobs.length === 0 ? (
        <p className="text-center">You have not created any jobs yet.</p>
      ) : (
        jobs.map(job => (
          <Card key={job.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{job.title}</Card.Title>
              <Card.Text>{job.description}</Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate(`/hr/jobs/${job.id}`)}
              >
                View Details
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Home;