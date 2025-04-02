import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uploadVideo, computeScores, getJobById, updateStatus } from '../services/api';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { UPDATED_STATUS } from '../utilities/constants';

const QuestionCard = ({
  question,
  questionId,
  jobId,
  questionNumber,
  totalQuestions,
  onSubmit,
  onBack,
  isLastQuestion,
}) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || localStorage.getItem('userId');
  const [uploading, setUploading] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    const storedFileData = localStorage.getItem(`videoFile_${questionId}_${jobId}_${userId}`);
    console.log("User id in Question Form:", userId);
    console.log("Job id in Question Form:", jobId);
    if (storedFileData) {
      toast.info('A previously selected video file was found. Please re-upload if needed.');
    }
  }, [questionId, jobId, userId]);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload an .mp4 or .mov file.');
      setVideoFile(null);
      setVideoUrl(null);
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size exceeds 50MB limit.');
      setVideoFile(null);
      setVideoUrl(null);
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      setVideoDuration(duration);
      if (duration > 30) {
        toast.error('Video duration exceeds 30 seconds. Please upload a shorter video.');
        setVideoFile(null);
        setVideoUrl(null);
      } else {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        localStorage.setItem(
          `videoFile_${questionId}_${jobId}_${userId}`,
          JSON.stringify({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          })
        );
      }
    };
    video.src = URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error('Please upload a video file.');
      return;
    }

    if (!userId || !jobId || isNaN(jobId)) {
      toast.error('Missing or invalid user ID or job ID. Please start the application process again.');
      return;
    }

    setUploading(true);
    setSubmissionError(null);
    try {
      // Step 1: Upload the video
      const videoResponseData = { userId, questionId, jobId };
      console.log('Uploading video for userId:', userId, 'questionId:', questionId);
      const videoResponse = await uploadVideo(videoResponseData, videoFile);
      console.log('Video upload response:', videoResponse.data);
      if (videoResponse.data.response !== "success") {
        toast.error('Video upload failed');
        return
      }
      toast.success('Video uploaded successfully!');

      // Step 2: If this is the last question, compute scores and update status
      if (isLastQuestion) {
        const job = await getJobById(jobId);
        const hrId = job.data.hrId;
        console.log('Computing scores for userId:', userId, 'jobId:', jobId, 'hrId:', hrId);
        const scoreResponse = await computeScores({ hrId, userId, jobId });
        console.log('Compute scores response:', scoreResponse.data);
        // toast.success('Scores computed successfully!'); // Add here check if response == success

        console.log('Updating status to PASSED for userId:', userId, 'jobId:', jobId);
        const statusResponse = await updateStatus({ userId, jobId, status: UPDATED_STATUS });
        console.log('Update status response:', statusResponse.data);
        if (statusResponse.data.response !== "success") {
          toast.error('Failed to update status');
          return
        }
        console.log('Application status updated to PASSED!')
        toast.success('All your videos have been submitted successfully!');
      }

      localStorage.removeItem(`videoFile_${questionId}_${jobId}_${userId}`);
      setIsUploaded(true);
      setVideoFile(null);
      setVideoUrl(null);
    } 
    catch (err) {
      const message = err.response?.data?.error || 'Failed to upload video. Please try again.';
      console.error('Error in handleSubmit:', err);
      setSubmissionError(message);
      toast.error(message);
    } 
    finally {
      setUploading(false);
    }
  };

  const handleRetry = () => {
    setSubmissionError(null);
    handleSubmit(new Event('submit'));
  };

  const handleNextOrFinish = () => {
    if (!isUploaded) {
      toast.error('Please upload the video before proceeding.');
      return;
    }
    onSubmit();
  };

  return (
    <Card className="shadow-sm p-4 mb-4">
      <Card.Body>
        <Card.Title className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {question}
        </Card.Title>
        <Card.Subtitle className="text-center mb-4 text-muted">
          Question {questionNumber} of {totalQuestions}
        </Card.Subtitle>
        <div className="mb-4">
          <h5>Instructions:</h5>
          <ul>
            <li>Video should not exceed 30 seconds.</li>
            <li>Ensure you are in front of the camera.</li>
            <li>Speak clearly and confidently.</li>
            <li>Upload the video in .mp4 or .mov format.</li>
          </ul>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="videoUpload" className="mb-3">
            <Form.Label>Upload Your Video Response</Form.Label>
            <Form.Control
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleFileChange}
              disabled={uploading || isUploaded}
            />
            {videoFile && (
              <div className="mt-3">
                <p>
                  Selected file: {videoFile.name} (
                  {videoDuration ? `${videoDuration.toFixed(1)} seconds` : 'Calculating duration...'})
                </p>
                {videoUrl && (
                  <video
                    controls
                    src={videoUrl}
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                    className="mt-2"
                  />
                )}
              </div>
            )}
          </Form.Group>
          <div className="d-flex justify-content-center mb-3">
            <Button
              variant="primary"
              type="submit"
              size="sm"
              disabled={uploading || !videoFile || isUploaded}
            >
              {uploading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Uploading...
                </>
              ) : (
                'Upload Now'
              )}
            </Button>
          </div>
          {submissionError && (
            <div className="text-danger text-center mb-3">
              {submissionError}
              <Button
                variant="link"
                onClick={handleRetry}
                className="p-0 ms-2"
              >
                Retry
              </Button>
            </div>
          )}
          <Row>
            <Col xs={6}>
              <Button
                variant="secondary"
                size="sm"
                onClick={onBack}
                disabled={uploading}
              >
                Back
              </Button>
            </Col>
            <Col xs={6} className="text-end">
              {!isLastQuestion && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNextOrFinish}
                  disabled={uploading || !isUploaded}
                >
                  Next
                </Button>
              )}
              {isLastQuestion && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleNextOrFinish}
                  disabled={uploading || !isUploaded}
                >
                  Finish
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;