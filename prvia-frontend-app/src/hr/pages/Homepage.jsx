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
        console.log('Fetching jobs for HR ID:', hrId);
        const response = await getJobs(hrId);
        console.log('Jobs fetched successfully:', response.data);
        setJobs(response.data.jobs);
        setError(null);

      } 
      catch (err) {
        console.error('Error fetching jobs:', err);
        // Only set error for authentication issues, not for empty jobs
        if (err.response?.status === 401 || err.response?.status === 403) {
          const message = 'Authentication error. Please log in again.';
          setError(message);
          toast.error(message);
        } 
        else {
          console.log('No jobs available at the moment.',err);
          // Set jobs as empty array but don't treat as error
          setJobs([]);
        }
      } 

      finally {
        setLoading(false);
      }
    };
    if (hrId) {
      fetchJobs();
    } 
    else {
      setLoading(false);
      setError('Please log in to view your jobs.');
      toast.error('Please log in to view your jobs.');
    }
  }, [hrId]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  // Only show error message for authentication issues, not for empty jobs
  if (error && !hrId) return <div className="text-danger text-center mt-5">{error}</div>;
  // if (error) return <div className="text-danger text-center mt-5">{error}</div>;

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