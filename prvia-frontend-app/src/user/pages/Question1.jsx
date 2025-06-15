// src/user/pages/Question1.jsx
import  { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJobById } from '../../services/api';
import { Container, Spinner } from 'react-bootstrap';
import QuestionCard from '../../components/QuestionCard';
import '../../styles/QuestionCardStyle.css'

const Question1 = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  console.log('Question 1:')
  console.log("Search params url ", searchParams);

  const userId = searchParams.get('userId') || localStorage.getItem('userId');
  const jobId = searchParams.get('jobId') || localStorage.getItem('jobId');

  console.log("user id :", userId);
  console.log("job id :", jobId);

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
        const q = job.questions[0];

        if (!q) {
          throw new Error('Question 1 not found');
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
    navigate(`/question/2${query}`);
  };

  const handleBack = () => {
    navigate('/apply');
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <Container className="question-card-container">
      <QuestionCard
        question={question}
        questionId={1}
        jobId={parseInt(jobId)}
        questionNumber={1}
        totalQuestions={3}
        onSubmit={handleSubmit}
        onBack={handleBack}
        isLastQuestion={false}
      />
    </Container> 
  );
};

export default Question1;