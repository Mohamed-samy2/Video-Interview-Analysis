import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { getUsersByJobId, getVideosByUserAndJob } from '../../services/api';
import { toast } from 'react-toastify';
import { UPDATED_STATUS } from '../../utilities/constants';

const PassedApplicantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoModal, setVideoModal] = useState({ show: false, videos: [] });

  useEffect(() => {
    const fetchApplicantsAndVideos = async () => {
      try {
        // Fetch applicants
        const response = await getUsersByJobId(id);
        const passedApplicants = response.data.filter(
          applicant => applicant.status.toLowerCase() === UPDATED_STATUS.toLowerCase()
        );
        console.log('Passed Applicants:', passedApplicants);

        // Fetch video responses for each applicant
        const applicantsWithVideos = await Promise.all(
          passedApplicants.map(async (applicant) => {
            try {
              const videoResponse = await getVideosByUserAndJob(applicant.userId, id);
              return {
                ...applicant,
                videos: videoResponse.data,
                // Placeholder for scores and summary (to be updated later)
                personalityTraitsScore: 'N/A',
                textSummary: 'N/A',
                extraInfo: 'N/A',
              };
            } catch (err) {
              console.error('Error fetching videos for userId:', applicant.userId, err);
              return {
                ...applicant,
                videos: [],
                personalityTraitsScore: 'Error',
                textSummary: 'Error',
                extraInfo: 'Error',
              };
            }
          })
        );

        setApplicants(applicantsWithVideos);
      } catch (err) {
        const message = err.response?.data?.error || 'Failed to fetch passed applicants. Please try again.';
        console.error('Error fetching passed applicants:', err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicantsAndVideos();
  }, [id]);

  const handleReviewVideos = (videos) => {
    console.log('Opening video modal with videos:', videos);
    setVideoModal({ show: true, videos });
  };

  const handleCloseModal = () => {
    console.log('Closing video modal');
    setVideoModal({ show: false, videos: [] });
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Passed Applicants for Job ID: {id}</h2>
      {applicants.length === 0 ? (
        <Alert variant="info">No passed applicants for this job.</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {/* <th>User ID</th> */}
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Gender</th>
                <th>Education</th>
                <th>CV URL</th>
                <th>Status</th>
                <th>Personality Traits Score</th>
                <th>Text Summary</th>
                <th>Extra Info</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(applicant => (
                <tr key={applicant.userId}>
                  {/* <td>{applicant.userId}</td> */}
                  <td>{applicant.firstName}</td>
                  <td>{applicant.lastName}</td>
                  <td>{applicant.email || 'N/A'}</td>
                  <td>{applicant.phoneNumber || 'N/A'}</td>
                  <td>{applicant.gender || 'N/A'}</td>
                  <td>{applicant.education || 'N/A'}</td>
                  <td>
                    {applicant.cv ? (
                      <a href={applicant.cv} target="_blank" rel="noopener noreferrer">
                        View CV
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{applicant.status}</td>
                  <td>{applicant.personalityTraitsScore}</td>
                  <td>{applicant.textSummary}</td>
                  <td>{applicant.extraInfo}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleReviewVideos(applicant.videos)}
                      disabled={!applicant.videos || applicant.videos.length === 0}
                    >
                      Review Videos
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Modal show={videoModal.show} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Video Responses</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {videoModal.videos.length === 0 ? (
                <Alert variant="warning">No videos available.</Alert>
              ) : (
                videoModal.videos.map(video => (
                  <div key={video.id} className="mb-3">
                    <h6>Question {video.questionId}</h6>
                    <video
                      controls
                      src={`http://localhost:3001${video.videoUrl}`}
                      style={{ maxWidth: '100%', maxHeight: '400px' }}
                    />
                  </div>
                ))
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => navigate(`/hr/jobs/${id}`)}>
          Back to Job Details
        </Button>
      </div>
    </Container>
  );
};

export default PassedApplicantsPage;