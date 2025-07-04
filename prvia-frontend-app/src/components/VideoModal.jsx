// src/components/VideoModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const VideoModal = ({ show, onHide, videos }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Video Responses</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {videos && videos.length > 0 ? (
          videos.map((video, index) => (
            <div key={index} className="mb-4">
              <h5>Question {video.questionId}</h5>
              <video
                controls
                src={video.url}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
                className="mt-2"
              />
            </div>
          ))
        ) : (
          <p>No video responses available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VideoModal;