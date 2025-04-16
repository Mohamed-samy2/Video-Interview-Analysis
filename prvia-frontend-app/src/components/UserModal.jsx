import React, { useEffect, useState } from 'react';
import { Modal, Button, Accordion, Alert ,Spinner} from 'react-bootstrap';
import { getUserScores, updateStatus } from '../services/api'
import { toast } from 'react-toastify';
import { ACCEPTED_STATUS, REJECTED_STATUS } from '../utilities/constants'

const UserModal = ({ show, onHide, userId, jobId, onStatusUpdate }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show || !userId || !jobId) return;

    const fetchDetails = async () => {
      try {
        const response = await getUserScores(userId, jobId);
        console.log('User details:', response.data);
        setDetails(response.data);
      } 
      catch (err) {
        const message = err.response?.data?.error || 'Failed to load details. Please try again.';
        setError(message);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [show, userId, jobId]);

  const handleStatusChange = async (status) => {
    try {
      const response = await updateStatus({ userId, jobId, status });
      console.log('Update status response:', response.data);
      toast.success(`Applicant ${status.toLowerCase()} updated to ${status} successfully!`);
      onStatusUpdate(userId);
    } 
    catch (err) {
      const message = err.response?.data?.error || `Failed to update status to ${status}. Please try again.`;
      console.log('Error updating status:', err,message);
      toast.error(`Failed to update status to ${status}. Please try again.`);
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Applicant Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <h5>Personal Information</h5>
            <p><strong>First Name:</strong> {details.first_name}</p>
            <p><strong>Last Name:</strong> {details.last_name}</p>
            <p><strong>Email:</strong> {details.email}</p>
            <p><strong>Phone Number:</strong> {details.phone}</p>
            <p>
              <strong>CV:</strong>{' '}
              {details.cv ? (
                 <a href={`/Backend/src/${details.cv}`}  target="_blank" rel="noopener noreferrer">
                  View CV
                </a>
              ) : (
                'N/A'
              )}
            </p>

            <h5>Personality Traits</h5>
            <p><strong>Agreebleness:</strong> {details.traits1}</p>
            <p><strong>Conscientiousness:</strong> {details.traits2}</p>
            <p><strong>Extraversion:</strong> {details.traits3}</p>
            <p><strong>Neutrocisim:</strong> {details.traits4}</p>
            <p><strong>Openness:</strong> {details.traits4}</p>
            
            <h5>Personality Traits</h5>
            
            <p><strong>Facial Expressions Score:</strong> {details.facialExpressionsScore}</p>
            <p><strong>English Proficiency Score:</strong> {details.englishProficiencyScore}</p>
            <p><strong>Cheated:</strong> {details.cheated ? 'Yes' : 'No'}</p>

            <h5>Interview Questions</h5>
            {details.questions && details.questions.length > 0 ? (
              <Accordion>
                {details.questions.map((q, index) => (
                  <Accordion.Item eventKey={q.id.toString()} key={q.id}>
                    <Accordion.Header>
                      Question {index + 1}: {q.question}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p><strong>Summary:</strong> {q.summary}</p>
                      <p><strong>Relevancy Score:</strong> {q.relevance}</p>
                      {q.videoFile ? (
                        <video
                          controls
                          src={`http://localhost:3001${q.videoFile}`}
                          style={{ maxWidth: '100%', maxHeight: '400px' }}
                        />
                      ) : (
                        <p>No video available.</p>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <Alert variant="info">No questions available.</Alert>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!loading && !error && (
          <>
            <Button
              variant="success"
              onClick={() => handleStatusChange(ACCEPTED_STATUS)}
            >
              Accept
            </Button>
            <Button
              variant="danger"
              onClick={() => handleStatusChange(REJECTED_STATUS)}
            >
              Reject
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;