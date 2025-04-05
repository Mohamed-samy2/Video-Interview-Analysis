// src/components/JobCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';

function JobCard({ job, onClick }) {
  return (
    <Card className="mb-3 job-card">
      <Card.Body>
        <Card.Title>{job.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{job.company_name}</Card.Subtitle>
        <Card.Text>
          Salary: {job.salary} EGP
        </Card.Text>
        <Button variant="primary" onClick={() => onClick(job.id)}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default JobCard;