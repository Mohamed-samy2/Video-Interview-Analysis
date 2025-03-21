// // src/pages/YourProfile.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getHRJobs } from '../services/api'; // Add API function
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const YourProfile = () => {
  const navigate = useNavigate();
  const { hrId, logout } = useAuth(); 
  const [hrDetails, setHrDetails] = useState(null);
  const [createdJobs, setCreatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedHrDetails = JSON.parse(localStorage.getItem('hrDetails'));
    setHrDetails(storedHrDetails);

    // // Fetch HR details (name, email)
    // const fetchHRDetails = async () => {
    //   try {
    //     const response = await getHRDetails(hrId); // Fetch user details using ID
    //     setHrDetails(response.data);
    //   } catch (error) {
    //     console.error('Error fetching HR details:', error);
    //     toast.error('Failed to load profile details.');
    //   }
    // };

    // Fetch hr jobs
    const fetchJobs = async () => {
      try {
        const response = await getHRJobs(hrId);
        setCreatedJobs(response.data.data || response.data);
      }
       catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs.');
      } 
      finally {
        setLoading(false);
      }
    };

    // fetchHRDetails();
    fetchJobs();
  }, [hrId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-5">
      <Button variant="primary" onClick={() => navigate('/')} className="mb-4">
        Back to Home
      </Button>
      <Card className="job-details-card">
        <Card.Body>
          <Card.Title>Your Profile</Card.Title>
          <Card.Text>
            <strong>Name:</strong> {hrDetails?.name || "Not Available"}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {hrDetails?.email || "Not Available"}
          </Card.Text>
          <Button variant="danger" onClick={handleLogout} className="mt-3">
            Logout
          </Button>
          <Card.Title className="mt-4">Jobs You Created</Card.Title>
          {createdJobs.length > 0 ? (
            <ListGroup variant="flush">
              {createdJobs.map(job => (
                <ListGroup.Item key={job.id}>
                  {job.title} - ${job.salary}
                  <Button
                    variant="link"
                    onClick={() => navigate(`/jobs/${job.id}`)}
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



// import React, { useState, useEffect, use } from 'react';
// import { Container, Card, Button, ListGroup, Spinner } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import {  getHRJobs } from '../services/api';
// import { toast } from 'react-toastify';
// import { useAuth } from '../context/AuthContext'; // Import Auth Context

// const YourProfile = () => {
//   const navigate = useNavigate();
//   const [hrID, setHrID] = useState(null);
//   const { hrId, logout } = useAuth(); 
//   const [createdJobs, setCreatedJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch user from localStorage
//     if (!hrId) {
//       toast.error('Please log in to view your profile.');
//       navigate('/login'); // Redirect if not authenticated
//       return;
//     }
   
//     console.log(hrId)
//     const fetchJobs = async () => {
//          try {
//           const response = await getHRJobs(hrId); // Use hrId in API call
//            setCreatedJobs(response.data);
//            console.log('Fetched jobs:', response.data);
//          } 
//          catch (error) {
//            console.error('Error fetching jobs:', error);
//            toast.error('Failed to load jobs. Please try again.');
//          } 
//          finally {
//            setLoading(false);
//          }
//        };
   
//        fetchJobs();
//      }, [navigate, hrId]);

//   if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
//   // console.log(user.Name)

//   return (
//     <Container className="mt-5">
//       <Button variant="primary" onClick={() => navigate('/')} className="mb-4">
//         Back to Home
//       </Button>
//       <Card className="job-details-card">
//         <Card.Body>
//           <Card.Title>Your Profile</Card.Title>
//           <Card.Text>
//             <strong>Name:</strong> {user.Name}
//           </Card.Text>
//           <Card.Text>
//             <strong>Email:</strong> {user.email}
//           </Card.Text>
//           <Card.Title className="mt-4">Jobs You Created</Card.Title>
//           {createdJobs.length > 0 ? (
//             <ListGroup variant="flush">
//               {createdJobs.map(job => (
//                 <ListGroup.Item key={job.id}>
//                   {job.title} - ${job.salary}
//                   <Button
//                     variant="link"
//                     onClick={() => navigate(`/jobs/${job.id}`)}
//                     className="ms-2"
//                   >
//                     View Details
//                   </Button>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           ) : (
//             <p>You haven't created any jobs yet.</p>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default YourProfile;





{/* Old Code */}
// const YourProfile = () => {
//   const navigate = useNavigate();
//   const [hrID, setHrID] = useState(null);
//   const { hrId, logout } = useAuth(); 
//   const [createdJobs, setCreatedJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch user from localStorage
//     if (!hrId) {
//       navigate('/login'); // Redirect if not authenticated
//       return;
//     }
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     console.log(storedUser)
//     if (storedUser) {
//       setHrID(storedUser);
//       console.log("here")
//       // console.log("Stored user is ",storedUser)
//       // console.log("user is ",user)
//     } else {
//       navigate('/login');
//       return;
//     }

//     // Fetch jobs created by the user
//     const fetchUserJobs = async () => {
//       try {
//         const adminId = storedUser.email; 
//         const response = await getJobs(adminId);
//         setCreatedJobs(response.data); // FastAPI might wrap data in "data" key
//       } catch (error) {
//         console.error('Error fetching user jobs:', error);
//         toast.error('Failed to load your jobs.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserJobs();
//   }, [navigate]);
//   console.log("User is",user)

//   if (!user) return <div>Please log in to view your profile.</div>;
//   if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
//   console.log(user.Name)

//   return (
//     <Container className="mt-5">
//       <Button variant="primary" onClick={() => navigate('/')} className="mb-4">
//         Back to Home
//       </Button>
//       <Card className="job-details-card">
//         <Card.Body>
//           <Card.Title>Your Profile</Card.Title>
//           <Card.Text>
//             <strong>Name:</strong> {user.Name}
//           </Card.Text>
//           <Card.Text>
//             <strong>Email:</strong> {user.email}
//           </Card.Text>
//           <Card.Title className="mt-4">Jobs You Created</Card.Title>
//           {createdJobs.length > 0 ? (
//             <ListGroup variant="flush">
//               {createdJobs.map(job => (
//                 <ListGroup.Item key={job.id}>
//                   {job.title} - ${job.salary}
//                   <Button
//                     variant="link"
//                     onClick={() => navigate(`/jobs/${job.id}`)}
//                     className="ms-2"
//                   >
//                     View Details
//                   </Button>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           ) : (
//             <p>You haven't created any jobs yet.</p>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default YourProfile;


