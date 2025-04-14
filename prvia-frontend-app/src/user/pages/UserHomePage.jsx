// src/user/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { getAllJobs } from '../../services/api';
// import { toast } from 'react-toastify';

const UserHome = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Redirect HR users to their homepage (redundant due to AppRoutes, but added for safety)
  useEffect(() => {
    if (isLoggedIn && role === 'hr') {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, role, navigate]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        setJobs(response.data.jobs);
        console.log('Fetched jobs:', response.data.jobs);
        console.log('Jobs:', jobs);
      } 
      catch (err) {
        console.log('No jobs available at the moment.')
        const message = err.response?.data?.error || 'No Jobs Available at the moment';
        console.error('Error fetching jobs:', err,message);
       
        // Set jobs as empty array but don't treat as error
        setJobs([]);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  // if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Available Jobs</h1>
      {jobs.length === 0 ? (
        <p className="text-center">No jobs available at the moment.</p>
      ) : (
        jobs.map(job => (
          <Card key={job.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{job.title}</Card.Title>
              <Card.Text>{job.description}</Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate(`/job/${job.id}`)}
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

export default UserHome;