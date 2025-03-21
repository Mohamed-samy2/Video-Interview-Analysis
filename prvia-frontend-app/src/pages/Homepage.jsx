import React, { useState, useEffect } from 'react';
import { getJobs } from '../services/api'; // Use getJobs instead of getHRJobs
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { hrId, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs(hrId);
        setJobs(response.data.data || response.data); // Handle wrapped/unwrapped response
        console.log('Fetched jobs:', response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [hrId]);

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

  const viewDetails = (job) => {
    console.log(`View details for job ${job.id}`);
    navigate(`/jobs/${job.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Jobs</h2>
        <div>
          <Button as={Link} to="/jobs/new" variant="primary" className="me-3">
            Create New Job
          </Button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <div className="row">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div className="col-md-4" key={job.id}>
              <JobCard job={job} onClick={() => viewDetails(job)} />
            </div>
          ))
        ) : (
          <p>No jobs available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;



// import React,{useState,useEffect} from 'react';
// import { getJobs } from '../services/api';
// import { Button } from 'react-bootstrap';
// import { toast } from 'react-toastify'; 
// import { Link, useNavigate } from 'react-router-dom';
// import JobCard from '../components/JobCard';
// import Spinner from 'react-bootstrap/Spinner';

// const Home = () => {

//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const storedUser = JSON.parse(localStorage.getItem('user'));
//         if (!storedUser || !storedUser.id) {
//           navigate('/login');
//           return;
//         }
//         console.log(storedUser)
//         const adminId = storedUser.email; // Get admin ID from localStorage
//         const response = await getJobs(adminId); 
//         setJobs(response.data); // Adjust based on FastAPI response format if needed
//         console.log('Fetched jobs:', response.data);
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//         toast.error('Failed to load jobs. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, [navigate]);

//   if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  
//   const viewDetails = (job) => {
//     console.log(`View details for job ${job.id}`);
//     navigate(`/jobs/${job.id}`); // Navigate to the JobDetails page with the job ID
//   };
  
//   return (  
//      <div className="container mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Available Jobs</h2>
//         <Button as={Link} to="/jobs/new" variant="primary" className="mb-4">
//           Create New Job
//         </Button>
//       </div>
//       <div className="row">
//         {jobs.length > 0 ? (
//           jobs.map((job) => (
//             <div className="col-md-4" key={job.id}>
//               <JobCard job={job} onClick={() => viewDetails(job)} />
//             </div>
//           ))
//         ) : (
//           <p>No jobs available.</p>
//         )}
//       </div>
//     </div>
//     );
// }
 
// export default Home;