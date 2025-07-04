// src/user/pages/Home.jsx
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {Container, Spinner } from 'react-bootstrap';
import { getAllJobs } from '../../services/api';

import { MdSearchOff } from "react-icons/md";
import JobCard from '../../components/JobCard';
import '../../styles/JobCardStyle.css'
import Footer from '../../components/Footer';


const UserHome = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (isLoggedIn && role === 'hr') {
    navigate('/hr', { replace: true }); // Redirect HR to /hr instead of /
  }
  else  {
    navigate('/'); // Redirect User to /user instead of /
  }
}, [isLoggedIn, role, navigate]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        setJobs(Array.isArray(response.data.jobs) ? response.data.jobs : []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <>
    <Container className="job-cards-large-container custom-container" >
      <div className="section-header">
        <h2>Explore Jobs</h2>
      </div>
      {!Array.isArray(jobs) || jobs.length === 0 ? (
       <div className="no-jobs-message">
        <MdSearchOff className='custom-no-results-icon' size={50} color="#514A9D"/>
         <h1>Currently, There Are No Jobs Available</h1>
        <p>Check back later for new opportunities</p>
        </div>
      ) : (
        <div className="job-card-container">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => navigate(`/job/${job.id}`)} />
          ))}
        </div>
      )}
    </Container>
    <Footer />
    </>
  );
};

export default UserHome;



// // src/user/pages/UserHome.jsx
// // src/user/pages/UserHome.jsx
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Container, Spinner } from 'react-bootstrap';
// import { getAllJobs } from '../../services/api';
// import { MdSearchOff } from "react-icons/md";
// import JobCard from '../../components/JobCard';
// import '../../styles/JobCardStyle.css';
// import Footer from '../../components/Footer';

// const UserHome = () => {
//   const navigate = useNavigate();
//   const { isLoggedIn, role } = useAuth();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Redirect HR users to their home page
//     if (isLoggedIn && role === 'hr') {
//       navigate('/hr', { replace: true });
//     }
//   }, [isLoggedIn, role, navigate]);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await getAllJobs();
//         console.log('API Response:', response.data); // Debug API response
//         setJobs(Array.isArray(response.data.jobs) ? response.data.jobs : []);
//       } catch (err) {
//         console.error('Error fetching jobs:', err);
//         setJobs([]); // Ensure jobs is an array even on error
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchJobs();
//   }, []);

//   if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

//   return (
//     <>
//       <Container className="job-cards-large-container custom-container">
//         <div className="section-header">
//           <h2>Explore Jobs</h2>
//         </div>
//         {!Array.isArray(jobs) || jobs.length === 0 ? (
//           <div className="no-jobs-message">
//             <MdSearchOff className="custom-no-results-icon" size={50} color="#514A9D" />
//             <h1>Currently, There Are No Jobs Available</h1>
//             <p>Check back later for new opportunities</p>
//           </div>
//         ) : (
//           <div className="job-card-container">
//             {jobs.map(job => (
//               <JobCard key={job.id} job={job} onClick={() => navigate(`/job/${job.id}`)} />
//             ))}
//           </div>
//         )}
//       </Container>
//       <Footer />
//     </>
//   );
// };

// export default UserHome;