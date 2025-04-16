// // src/user/pages/ThankYou.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { computeScores, getJobById } from '../../services/api';

import { Container, Card, Button } from 'react-bootstrap';

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, jobId } = location.state || {};

  useEffect(() => {
    const computeApplicationScores = async () => {
      if (!userId || !jobId) {
        toast.error('Missing user ID or job ID.');
        navigate('/');
        return;
      }

      try {
        // Fetch hrId for computeScores
        const job = await getJobById(jobId);
        const hrId = job.data.hrId;

        // Call computeScores
        console.log('Computing scores for userId:', userId, 'jobId:', jobId, 'hrId:', hrId);
        const scoreResponse = await computeScores({ hrId, userId, jobId });
        console.log('Compute scores response:', scoreResponse.data);
        if (scoreResponse.data.response !== "success") {
         console.log('Error in computing scores:', scoreResponse);
       return
      }
        // toast.success('Scores computed successfully!');
      } 
      catch (err) {
        console.error('Error in computing scores:', err);
        // toast.error('Failed to compute scores. Please contact support.');
      }
    };

    computeApplicationScores();
  }, [userId, jobId, navigate]);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card
        className="shadow-lg"
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: '#f8f9fa',
          border: 'none',
          borderRadius: '15px',
        }}
      >
        <Card.Body className="text-center p-5">
          <Card.Title as="h1" className="mb-4" style={{ color: '#28a745', fontWeight: 'bold' }}>
            Thank You!
          </Card.Title>
          <Card.Text className="mb-4" style={{ color: '#343a40', fontSize: '1.1rem' }}>
            Your application has been successfully submitted! We’re excited to review your video responses. 
            Wishing you the best of luck—we hope to welcome you to our team soon!
          </Card.Text>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleClose}
          >
            Back to home
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ThankYou;

// import React from 'react';
// import { useNavigate } from 'react-router-dom'; 
// import { Container, Card, Button } from 'react-bootstrap';

// const ThankYou = () => {
//   const navigate = useNavigate();
//   const handleClose = () => {
//     // Redirect to the / (home) page instead of closing the tab
//     navigate('/');
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
//       <Card
//         className="shadow-lg"
//         style={{
//           maxWidth: '500px',
//           width: '100%',
//           backgroundColor: '#f8f9fa',
//           border: 'none',
//           borderRadius: '15px',
//         }}
//       >
//         <Card.Body className="text-center p-5">
//           <Card.Title as="h1" className="mb-4" style={{ color: '#28a745', fontWeight: 'bold' }}>
//             Thank You!
//           </Card.Title>
//           <Card.Text className="mb-4" style={{ color: '#343a40', fontSize: '1.1rem' }}>
//             Your application has been successfully submitted! We’re excited to review your video responses. 
//             Wishing you the best of luck—we hope to welcome you to our team soon!

//             {/* <small className="text-muted">Click below to return to the home page to explore another jobs, or you can close this tab.</small> */}
//           </Card.Text>
//           <Button
//             variant="secondary"
//             size="lg"
//             onClick={handleClose}
//           >
//             Back to home 
//           </Button>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default ThankYou;