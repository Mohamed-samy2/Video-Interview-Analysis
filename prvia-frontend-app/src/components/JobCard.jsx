// src/components/JobCard.jsx
import { Card, Button } from 'react-bootstrap';
import '../styles/JobCardStyle.css'
import { FaBuilding } from 'react-icons/fa';

function JobCard({ job, onClick }) {
  if (!job) return null;
  console.log('Job Card Rendered:', job);
  const skillsArray = job.skills ? job.skills.split(',').map(skill => skill.trim()) : [];
  
  return (
    <Card className="job-card">
      <Card.Body>
        {/* Job Type Tag and Salary */}
        <div className="job-tag-rate">
          {job.job_type && <span className={`job-type ${job.job_type.toLowerCase()}`}>{job.job_type}</span>}
          {/* {job.salary && <span className="job-rate">{job.salary}</span>} */}
        </div>
        {/* Job Title and Company */}
        <Card.Title>{job.title}</Card.Title>
        {job.company && <Card.Subtitle className="mb-2 text-muted"><FaBuilding className="icon" />{job.company}</Card.Subtitle>}
        {/* Skills/Tags */}
        {skillsArray.length > 0 && (
          <div className="job-skills">
            {skillsArray.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
            <span className="skill-count">+{skillsArray.length}</span>
          </div>
        )}
        {/* Description */}
        {job.description && <Card.Text className="job-description">{job.description}</Card.Text>}
        <div className='custom-line'>
          {/* {"_____________"} */}
        </div>
        
        {/* View Button */}
        {onClick && (
          <Button variant="primary" className="btn-custom2" onClick={() => onClick(job.id)}>
            Apply
          </Button>
        )}
      </Card.Body>
    </Card>
  );



  // return (
  //   <Card className="job-card">
  //     <Card.Body>
  //       <Card.Title> {job.title}</Card.Title> 
  //       {job.company && <Card.Subtitle className="mb-2 text-muted"> <FaBuilding className="icon" />{job.company}</Card.Subtitle>}
  //       {job.description && <Card.Text>{job.description}</Card.Text>}
  //       {job.salary && <Card.Text>Salary: {job.salary} EGP</Card.Text>}
  //       {onClick && (
  //         <Button variant="primary" className="btn-custom2" onClick={() => onClick(job.id)}>
  //           View Details
  //         </Button>
  //       )}
  //     </Card.Body>
  //   </Card>
  // );
}

export default JobCard;