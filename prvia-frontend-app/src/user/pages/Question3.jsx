import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJobById } from '../../services/api';
import { Container, Spinner } from 'react-bootstrap';
import QuestionCard from '../../components/QuestionCard';

const Question3 = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  console.log('Question 3: Search params URL:', searchParams.toString());

  const userId = searchParams.get('userId') || localStorage.getItem('userId');
  const jobId = searchParams.get('jobId') || localStorage.getItem('jobId');

  console.log("Question 3: userId:", userId);
  console.log("Question 3: jobId:", jobId);

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
        const q = job.questions.find((q) => q.id === 3);
        if (!q) {
          throw new Error('Question 3 not found');
        }
        setQuestion(q.question);
      } 
      catch (error) {
        console.error('Error fetching question:', error);
        setError('Failed to fetch question. Please try again.');
        toast.error('Failed to fetch question.');
        navigate('/apply');
      } 
      finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [jobId, navigate]);

  const handleSubmit = () => {
    const query = userId ? `?userId=${userId}&jobId=${jobId}` : `?jobId=${jobId}`;
    console.log('Question 3: Navigating to thank-you page with query:', query);
    navigate(`/thank-you${query}`);
  };

  const handleBack = () => {
    const query = userId ? `?userId=${userId}&jobId=${jobId}` : `?jobId=${jobId}`;
    console.log('Question 3: Navigating back to Question 2 with query:', query);
    navigate(`/question/2${query}`);
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <Container className="mt-5">
      <QuestionCard
        question={question}
        questionId={3}
        jobId={parseInt(jobId)}
        questionNumber={3}
        totalQuestions={3}
        onSubmit={handleSubmit}
        onBack={handleBack}
        isLastQuestion={true}
      />
    </Container>
  );
};

export default Question3;