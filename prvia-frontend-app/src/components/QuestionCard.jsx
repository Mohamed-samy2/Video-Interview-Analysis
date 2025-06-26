import  { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uploadVideo, updateStatus } from '../services/api';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { UPDATED_STATUS } from '../utilities/constants';
import '../styles/QuestionCardStyle.css'

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

  useEffect(() => {
    const storedFileData = localStorage.getItem(`videoFile_${questionId}_${jobId}_${userId}`);
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


  const handleRetry = () => {
    setSubmissionError(null);
    handleNextOrFinish(new Event('submit'));
  };

  const handleNextOrFinish =  async (e) => {
    e.preventDefault();
    if ( !videoFile) {
      toast.error('Please upload the video before proceeding.');
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

      const videoResponse = await uploadVideo(videoResponseData, videoFile);
      toast.success('Video uploaded successfully!');
      localStorage.removeItem(`videoFile_${questionId}_${jobId}_${userId}`);
      setVideoFile(null);
      setVideoUrl(null);
      
      // Step 2: If this is the last question, update status
      if (isLastQuestion) {
        const statusResponse = await updateStatus({ userId, jobId, status: UPDATED_STATUS });
        toast.success('All your videos have been submitted successfully!');
      }

      // Proceed to the next page
      onSubmit();
    }

    catch (err) {
      const message = err.response?.data?.error || 'Failed to upload video. Please try again.';
      console.error('Error in handleNextOrFinish:', err);
      setSubmissionError(message);
      toast.error('Failed to upload video. Please try again.');
    } 
    finally {
      setUploading(false);
    }
    
    
  };

  return (
    <Card className="question-card">
      <Card.Body>
        <div className="question-card-title">
          {question}
        </div>
        <Card.Subtitle className="card-subtitle-custom">
          Question {questionNumber} of {totalQuestions}
        </Card.Subtitle>
       
       <div className="instructions-container">
        <h5 className="instructions-heading">Instructions:</h5>
        <ul className="instructions-list">
          <li className="instructions-item">Video should not exceed 30 seconds.</li>
          <li className="instructions-item">Ensure you are in front of the camera.</li>
          <li className="instructions-item">Speak clearly and confidently.</li>
          <li className="instructions-item">Upload the video in .mp4 or .mov format.</li>
        </ul>
      </div>
        
        <Form onSubmit={handleNextOrFinish}>
          <Form.Group controlId="videoUpload" className="upload-group">
          <Form.Label className="upload-label">Please upload your video for this question</Form.Label>
          <Form.Control
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleFileChange}
              disabled={uploading}
              className="upload-input"
            />
            {videoFile && (
             
             <div className="video-preview-container">
                <p>
                  Selected file: {videoFile.name} (
                  {videoDuration ? `${videoDuration.toFixed(1)} seconds` : 'Calculating duration...'})
                </p>
                {videoUrl && (
                  <video
                    controls
                    src={videoUrl}
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                    className="video-player"
                  />
                )}
              </div>
            )}
          
          </Form.Group>
          {submissionError && (
           <div className="error-message text-center mb-3">
              {submissionError}
              <Button
                variant="link"
                onClick={handleRetry}
                className="retry-button p-0 ms-2"
              >
                Retry
              </Button>
            </div>
          )}
          <Row>
            <Col xs={6}>
            {Number(questionNumber) !== 1 &&
              <Button
                variant="secondary"
                size="sm"
                onClick={onBack}
                disabled={uploading}
                className="back-button2"
              >
                Back
              </Button>
            }
            </Col>
            <Col xs={6} className="text-end">
              {!isLastQuestion && (
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={uploading || !videoFile}
                   className="next-button"
                >
                  {uploading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Uploading...
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
              )}
              {isLastQuestion && (
                <Button
                  variant="success"
                  size="sm"
                  type="submit"
                  disabled={uploading || !videoFile}
                  className="finish-button"
                >
                  {uploading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Uploading...
                    </>
                  ) : (
                    'Finish'
                  )}
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
 
