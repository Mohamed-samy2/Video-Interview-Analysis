// src/components/JobCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../styles/global.css'

function JobCard({ job, onClick }) {
  if (!job) return null;

  return (
    <Card className="job-card">
      <Card.Body>
        <Card.Title>{job.title}</Card.Title>
        {job.company_name && <Card.Subtitle className="mb-2 text-muted">{job.company_name}</Card.Subtitle>}
        {job.description && <Card.Text>{job.description}</Card.Text>}
        {job.salary && <Card.Text>Salary: {job.salary} EGP</Card.Text>}
        {onClick && (
          <Button variant="primary" onClick={() => onClick(job.id)}>
            View Details
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default JobCard;