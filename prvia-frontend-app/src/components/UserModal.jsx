import React, { useEffect, useState } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { getUserScores, updateStatus } from '../services/api';
import { toast } from 'react-toastify';
import { ACCEPTED_STATUS, REJECTED_STATUS } from '../utilities/constants';
import { FaUserCircle, FaFileAlt, FaArrowCircleUp } from 'react-icons/fa';
import ScoreBar from './ScoreBar';
import TraitIndicator from './TraitIndicator';
import '../styles/UserModal.css';

const UserModal = ({ show, onHide, userId, jobId, onStatusUpdate }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');
  const [showScorePopup, setShowScorePopup] = useState(false);

  useEffect(() => {
    if (!show || !userId || !jobId) return;

    const fetchDetails = async () => {
      try {
        const response = await getUserScores({
          user_id: parseInt(userId),
          job_id: parseInt(jobId)
        });
        setDetails(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [show, userId, jobId]);

  const handleStatusChange = async (status) => {
    try {
      await updateStatus({ userId, jobId, status });
      toast.success(`Applicant status updated to ${status}`);
      onStatusUpdate(userId);
      setShowScorePopup(false);
    } catch (err) {
      toast.error(`Failed to update status to ${status}.`);
    }
  };

  if (!show) return null;
  const currentQuestion = details?.questions?.[currentQuestionIndex];

  const traitData = [
    { name: "Agreeableness", trait: "trait1", pos: "Authentic", neg: "Self-Interested", desc: "Kindness and empathy." },
    { name: "Conscientiousness", trait: "trait2", pos: "Organized", neg: "Sloppy", desc: "Reliability and discipline." },
    { name: "Extraversion", trait: "trait3", pos: "Friendly", neg: "Reserved", desc: "Sociability and enthusiasm." },
    { name: "Neuroticism", trait: "trait4", pos: "Comfortable", neg: "Uneasy", desc: "Emotional stability." },
    { name: "Openness", trait: "trait5", pos: "Imaginative", neg: "Practical", desc: "Creativity and openness." }
  ];

const renderScorePopup = () => (
  <Modal show={showScorePopup} onHide={() => setShowScorePopup(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Total Score</Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-center">
      <div className="d-flex justify-content-center align-items-center gap-3">
        <FaArrowCircleUp
          size={64}
          color={
            details.total_score >= 8 ? 'green' :
            details.total_score >= 5 ? 'orange' :
            'red'
          }
        />
        <h4 className="mb-0">
          <strong>{details.total_score} / 10</strong>
        </h4>
      </div>

      <p className="mt-3">
        {details.total_score >= 8
          ? "Excellent performance!"
          : details.total_score >= 5
          ? "Moderate performance."
          : "Needs improvement."}
      </p>
    </Modal.Body>
    <Modal.Footer className="d-flex justify-content-center gap-3">
      <Button className="btn-gradient-accept" onClick={() => handleStatusChange(ACCEPTED_STATUS)}>Accept</Button>
      <Button className="btn-gradient-reject" onClick={() => handleStatusChange(REJECTED_STATUS)}>Reject</Button>
    </Modal.Footer>
  </Modal>
);

  return (
    <Modal show={show} onHide={onHide} size="xl" className="custom-modal wide-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-gradient w-100 text-center text-white py-2">
          Applicant Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="tab-header">
          <Button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <FaUserCircle className="me-2" /> Profile
          </Button>
          <Button className={`tab-button ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>
            <FaFileAlt className="me-2" /> Resume
          </Button>
        </div>

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : activeTab === 'profile' ? (
          <div className="modal-flex-container">
            {/* Video + Navigation */}
            <div className="video-column">
              <video
                key={currentQuestionIndex}
                controls
                src={`http://localhost:8000/${currentQuestion?.video}`}
                className="video-player"
              />
              <div className="video-nav">
                <Button variant="secondary" onClick={() => setCurrentQuestionIndex(i => i - 1)} disabled={currentQuestionIndex === 0}>Back</Button>
                <Button variant="primary" onClick={() => setCurrentQuestionIndex(i => i + 1)} disabled={currentQuestionIndex >= details.questions.length - 1}>Next</Button>
              </div>
              <div className="question-info">
                <p><strong>Current Question:</strong> {currentQuestion?.question}</p>
                <p><strong>Summary:</strong> {currentQuestion?.summary}</p>
                <ScoreBar label="Relevance Score" value={currentQuestion?.relevance} />
                <p><strong>Emotion:</strong> {currentQuestion?.emotion}</p>
              </div>
              {currentQuestionIndex === 2 && (
                <Button className="view-score-btn mt-3" onClick={() => setShowScorePopup(true)}>View Total Score</Button>
              )}
            </div>

            {/* Info Panel */}
            <div className="info-column">
              <h4>{details.first_name} {details.last_name}</h4>
              <p><strong>Email:</strong> {details.email}</p>
              <p><strong>Phone:</strong> {details.phone}</p>
              <hr />
              <ScoreBar label="English Score" value={details.total_english_score} />
              <p><strong>Personality Traits:</strong></p>
              {traitData.map(({ name, trait, pos, neg, desc }, idx) => (
                <TraitIndicator
                  key={idx}
                  traitName={name}
                  isPositive={details[trait] === pos}
                  positiveLabel={pos}
                  negativeLabel={neg}
                  description={desc}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="resume-section text-center">
            {details.cv ? (
              <iframe
                title="Resume Viewer"
                src={`http://localhost:8000/${details.cv}`}
                width="100%"
                height="500px"
                style={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              />
            ) : (
              <Alert variant="warning">No resume uploaded.</Alert>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>

      {showScorePopup && renderScorePopup()}
    </Modal>
  );
};

export default UserModal;
