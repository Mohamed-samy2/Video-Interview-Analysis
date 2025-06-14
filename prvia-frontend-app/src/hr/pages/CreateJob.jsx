// src/hr/pages/CreateJob.jsx
import React, { useState } from "react";
import { addJob } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from "react-bootstrap";
import '../../styles/CreateJobForm.css';

const CreateJob = () => {
  const [title, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [type, setType] = useState("");
  const [requirements, setRequirements] = useState("");
  const [questions, setQuestions] = useState([
    { id: 1, question: "" },
    { id: 2, question: "" },
    { id: 3, question: "" }
  ]);
  
  const [loading, setLoading] = useState(false);
  const { hrId } = useAuth();
  const navigate = useNavigate();

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, question: value } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if HR is logged in
    if (!hrId) {
      toast.error('Please log in to create a job.');
      navigate('/hr/login');
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        title: title,
        HRId: hrId,
        description: description,
        salary: Number(salary),
        company:company,
        skills: skills,
        job_type: type,
        requirements: requirements, 
        questions
      };
      const response = await addJob(jobData);
      
      // if (response.data.response !== "success") {
      //   toast.error('Failed to create job');
      //   return;
      // }
      toast.success("Job created successfully!");
      console.log("New Job created:",response.data);

      // Reset form fields
      setJobTitle("");
      setDescription("");
      setSalary("");
      setCompany("");
      setSkills("");
      setType("");
      setRequirements("");
      setQuestions([
        { id: 1, question: "" },
        { id: 2, question: "" },
        { id: 3, question: "" }
      ]);

      // Navigate back to homepage
      navigate('/hr');
    } 
    catch (error) {
      console.error('Error creating job:', error);
      toast.error("Error creating job. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  };

  // const handleCancel = () => {
  //   navigate('/hr');
  // };

  return (
    <Container className="create-job-form-container">
      {/* <h1>Please fill out the below details</h1> */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Job Title <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter job title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter job description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Salary <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
             min={0} 
             max={1000000}
             step={1} 
            placeholder="0"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Company Name <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Skills (comma-separated, e.g., JavaScript, React) <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="JavaScript, React"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Type <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Requirements (comma-separated, e.g., Bachelor’s degree, 3+ years)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Bachelor’s degree in Engineering, 3+ years Experience"
            required
          />
        </Form.Group>

        <h5>Interview Questions</h5>
        {questions.map((q, index) => (
          <Form.Group className="mb-3" key={q.id}>
            <Form.Label>Question {index + 1} <span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              required
            />
          </Form.Group>
        ))}

        <div className="text-center">
          <Button variant="primary" type="submit" disabled={loading} className="submit-button">
            {loading ? "Creating..." : "Submit"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateJob;