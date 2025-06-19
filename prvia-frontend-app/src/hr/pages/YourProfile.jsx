// src/hr/pages/YourProfile.jsx
import  { useState, useEffect } from 'react';
import { Container, Card, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../../services/api'; // Use getJobs instead of getHRJobs
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const YourProfile = () => {
  const navigate = useNavigate();
  const { hrId } = useAuth();
  const [hrDetails, setHrDetails] = useState(null);
  const [createdJobs, setCreatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedHrDetails = JSON.parse(localStorage.getItem('hrDetails'));
    setHrDetails(storedHrDetails);

    // Fetch HR jobs
    const fetchJobs = async () => {
      try {
        const response = await getJobs(hrId);
        console.log('Fetched jobs:', response.data);
        setCreatedJobs(response.data.jobs || []);
      } 
      catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs.');
      } 
      finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [hrId]);

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-5">
      <Button variant="primary" onClick={() => navigate('/hr')} className="mb-4">
        Back to Home
      </Button>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Your Profile</Card.Title>
          <Card.Text>
            <strong>Name:</strong> {hrDetails?.name || "Not Available"}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {hrDetails?.email || "Not Available"}
          </Card.Text>
          <Card.Title className="mt-4">Jobs You Created</Card.Title>
          {createdJobs.length > 0 ? (
            <ListGroup variant="flush">
              {createdJobs.map(job => (
                <ListGroup.Item key={job.id}>
                  {job.title}
                  <Button
                    variant="link"
                    onClick={() => navigate(`/hr/jobs/${job.id}`)}
                    className="ms-2"
                  >
                    View Details
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>You haven't created any jobs yet.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default YourProfile;