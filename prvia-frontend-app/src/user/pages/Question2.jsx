// src/user/pages/Question2.jsx
import  { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJobById } from '../../services/api';
import { Container, Spinner } from 'react-bootstrap';
import QuestionCard from '../../components/QuestionCard';
import '../../styles/QuestionCardStyle.css'


const Question2 = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  const userId = searchParams.get('userId') || localStorage.getItem('userId');
  const jobId = searchParams.get('jobId') || localStorage.getItem('jobId');

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!jobId) {
        toast.error('Invalid job ID. Please start the application process again.');
        navigate('/apply');
        return;
      }

      try {
        const response = await getJobById(jobId);
        const job = response.data;
        // const q = job.questions.find((q) => q.id === 2);
        const q = job.questions[1];
        if (!q) {
          throw new Error('Question 2 not found');
        }
        setQuestion(q.question);
      }
      catch (error) {
        console.error('Error fetching question:', error);
        setError('Failed to fetch question. Please try again.');
        toast.error('Failed to fetch question.');
        navigate('/');
      }
      finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [jobId, navigate]);

  const handleSubmit = () => {
    const query = userId ? `?userId=${userId}&jobId=${jobId}` : `?jobId=${jobId}`;
    navigate(`/question/3${query}`);
  };

  const handleBack = () => {
    const query = userId ? `?userId=${userId}&jobId=${jobId}` : `?jobId=${jobId}`;
    navigate(`/question/1${query}`);
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <Container className="question-card-container">
      <QuestionCard
        question={question}
        questionId={2}
        jobId={parseInt(jobId)}
        questionNumber={2}
        totalQuestions={3}
        onSubmit={handleSubmit}
        onBack={handleBack}
        isLastQuestion={false}
      />
    </Container>
  );
};

export default Question2;