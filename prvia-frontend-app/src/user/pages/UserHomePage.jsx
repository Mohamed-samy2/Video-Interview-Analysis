// // // src/user/pages/Home.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Container, Card, Spinner } from 'react-bootstrap';
// import { getAllJobs } from '../../services/api';
// import JobCard from '../../components/JobCard';

// const UserHome = () => {
//   const navigate = useNavigate();
//   const { isLoggedIn, role } = useAuth();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (isLoggedIn && role === 'hr') {
//       navigate('/', { replace: true });
//     }
//   }, [isLoggedIn, role, navigate]);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await getAllJobs();
//         setJobs(response.data.jobs || []);
//         console.log('Fetched jobs:', response.data.jobs);
//       } catch (err) {
//         console.error('Error fetching jobs:', err);
//         setJobs([]); // Ensure jobs is an empty array on error
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchJobs();
//   }, []);

//   if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

//   return (
//     <Container className="mt-5 py-4">
//       <h1 className="text-center mb-4">Available Jobs</h1>
//       {!Array.isArray(jobs) || jobs.length === 0 ? (
//         <div className="text-center">
//           <Card className="job-card mx-auto">
//             <Card.Body>
//               <Card.Title>No jobs available at the moment.</Card.Title>
//             </Card.Body>
//           </Card>
//         </div>
//       ) : (
//         <div className="job-cards-container">
//           {jobs.map(job => (
//             <JobCard key={job.id} job={job} onClick={() => navigate(`/job/${job.id}`)} />
//           ))}
//         </div>
//       )}
//     </Container>
//   );
// };

// export default UserHome;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Card, Spinner } from 'react-bootstrap';
import { getAllJobs } from '../../services/api';
import JobCard from '../../components/JobCard';

const UserHome = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && role === 'hr') {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, role, navigate]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        setJobs(Array.isArray(response.data.jobs) ? response.data.jobs : []);
        console.log('Fetched jobs:', response.data.jobs);
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
    <Container className="mt-5 py-4">
      <h1 className="text-center mb-4">Available Jobs</h1>
      {!Array.isArray(jobs) || jobs.length === 0 ? (
        <div className="text-center">
          <Card className="job-card mx-auto">
            <Card.Body>
              <Card.Title>No jobs available at the moment.</Card.Title>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div className="job-cards-container">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => navigate(`/job/${job.id}`)} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default UserHome;
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Container, Card, Spinner } from 'react-bootstrap';
// import { getAllJobs } from '../../services/api';
// import JobCard from '../../components/JobCard';
// // import { toast } from 'react-toastify';

// const UserHome = () => {
//   const navigate = useNavigate();
//   const { isLoggedIn, role } = useAuth();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // const [error, setError] = useState(null);

//   // Redirect HR users to their homepage (redundant due to AppRoutes, but added for safety)
//   useEffect(() => {
//     if (isLoggedIn && role === 'hr') {
//       navigate('/', { replace: true });
//     }
//   }, [isLoggedIn, role, navigate]);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await getAllJobs();
//         setJobs(response.data.jobs);
//         console.log('Fetched jobs:', response.data.jobs);
//         console.log('Jobs:', jobs);
//       } 
//       catch (err) {
//         console.log('No jobs available at the moment.')
//         const message = err.response?.data?.error || 'No Jobs Available at the moment';
//         console.error('Error fetching jobs:', err,message);
       
//         // Set jobs as empty array but don't treat as error
//         setJobs([]);
//       } 
//       finally {
//         setLoading(false);
//       }
//     };
//     fetchJobs();
//   }, []);