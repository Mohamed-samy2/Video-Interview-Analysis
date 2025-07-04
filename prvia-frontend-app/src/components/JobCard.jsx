// src/components/JobCard.jsx
import { Card, Button } from 'react-bootstrap';
import '../styles/JobCardStyle.css';
import { FaBuilding } from 'react-icons/fa';

function JobCard({ job, onClick }) {
  if (!job) return null;
  const skillsArray = job.skills ? job.skills.split(',').map(skill => skill.trim()) : [];

  // Truncate description to 3 lines with ellipsis
  const truncateDescription = (text) => {
    const lines = text.split('\n').slice(0, 3).join('\n');
    return lines.length < text.length ? lines + ' (...)' : lines;
  };

  return (
    <Card className="job-card">
      <Card.Body>
        {/* Job Type and Salary at Top */}
        <div className="job-top-info">
          {job.job_type && <span className="job-type-oval">{job.job_type}</span>}
          {job.salary && <span className="job-salary-oval">{job.salary} EGP</span>}
        </div>
        {/* Job Title and Company */}
        <Card.Title>{job.title}</Card.Title>
        {job.company && <Card.Subtitle className="mb-2 text-muted"><FaBuilding className="icon" />{job.company}</Card.Subtitle>}
        {/* Description */}
        {job.description && <Card.Text className="job-description">{truncateDescription(job.description)}</Card.Text>}
        {/* Skills/Tags */}
        {skillsArray.length > 0 && (
          <div className="job-skills">
            {skillsArray.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
            <span className="skill-count">+{skillsArray.length}</span>
          </div>
        )}
        <div className="custom-line"></div>
        {/* View Button */}
        {onClick && (
          <Button variant="primary" className="btn-custom2" onClick={() => onClick(job.id)}>
            VIEW
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default JobCard;