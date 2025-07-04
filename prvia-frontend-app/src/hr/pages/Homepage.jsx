// src/hr/pages/Home.jsx
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Button, Spinner } from 'react-bootstrap';
import { getJobs } from '../../services/api';
import { toast } from 'react-toastify';
import JobCard from '../../components/JobCard';
import '../../styles/JobCardStyle.css'
import { MdSearchOff } from "react-icons/md";
import { FaPlus } from 'react-icons/fa';
import Footer from '../../components/Footer';



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
        setJobs(response.data.jobs);
        setError(null);
      } 
      catch (err) {
        console.error('Error fetching jobs:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          const message = 'Authentication error. Please log in again.';
          setError(message);
          toast.error(message);
        } else {
          console.log('No jobs available at the moment.', err);
          setJobs([]);
        }
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
  if (error && !hrId) return <div className="text-danger text-center mt-5">{error}</div>;

  return(
    <>
    <Container className="job-cards-large-container custom-container" >
      <div className="section-header">
        <h2>Your Jobs</h2>
          <Button className="btn-custom" onClick={() => navigate('/hr/jobs/new')}>
          <FaPlus style={{ marginRight: '10px' }} />
          Add Job
        </Button>
      </div>
      {/* <div className="button-container"> */}
   
      {/* </div> */}
  
      {!Array.isArray(jobs) || jobs.length === 0 ? (
       <div className="no-jobs-message">
        <MdSearchOff className='custom-no-results-icon' size={50} color="#514A9D"/>
         <h1>You have not created any jobs yet</h1>
         <p>Click add job to add your first job!</p>
        </div>
      ) : (
        <div className="job-card-container">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => navigate(`/hr/jobs/${job.id}`)} />
          ))}
        </div>
      )}
    </Container>
    <Footer />
    </>

  );
}
export default Home;


