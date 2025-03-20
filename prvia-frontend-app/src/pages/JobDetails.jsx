import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJobById } from '../services/api';
import { Container, Card, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null); // Changed to null for better error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getJob = async () => {
      try {
        const response = await getJobById(id);
        setJob(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    getJob();
  }, [id]);

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <Container className="mt-5">
      <Card className="job-details-card">
        <Card.Body>
          <Card.Title>{job.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{job.company_name}</Card.Subtitle>
          <Card.Text>
            <strong>Salary:</strong> ${job.salary}
          </Card.Text>
          <Card.Text>
            <strong>Description:</strong> {job.description}
          </Card.Text>
          <Card.Text>
            <strong>Skills:</strong> {job.skills.join(', ')}
          </Card.Text>
          <Card.Text>
            <strong>Requirements:</strong>
            <ListGroup variant="flush">
              {job.requirements.map((req, index) => (
                <ListGroup.Item key={index}>{req}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Text>
          <Card.Text>
            <strong>Interview Questions:</strong>
            <ListGroup variant="flush">
              {job.questions.map((q) => (
                <ListGroup.Item key={q.id}>{q.question}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Text>
        </Card.Body>
      </Card>
      <Button variant="primary" onClick={() => navigate('/')} className="mb-4">
        Back to Home
      </Button>
    </Container>
  );
};

export default JobDetails;




// import React, { useState,useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { getJobById } from '../services/api';

// const JobDetails = () => {
//     const { id } = useParams(); // Extracts the job ID from the URL  
//     const [job, setJob] = useState({});
//     const [loading, setLoading] = useState(true);
    
//       useEffect(() => {
//         const getJob = async () => {
//           try {
//             const response = await getJobById(id);
//             setJob(response.data);
//           } catch (error) {
//             console.error('Error fetching jobs:', error);
//           } finally {
//             setLoading(false);
//           }
//         };
//         getJob();
//       }, [id]);
//       if (loading) return <div>Loading...</div>;
    
//     return <div>Showing details for Job ID: {id}
//     <h2> Job title: {job.title}</h2>
//     <p>{job.description}</p>
//     </div>;
//   };
  
//   export default JobDetails;
  