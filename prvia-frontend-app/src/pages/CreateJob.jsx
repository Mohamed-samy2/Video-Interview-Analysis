import React, { useState } from "react";
import { addJob } from '../services/api'; // Use addJob from api.js
import { useAuth } from '../context/AuthContext'; // Import Auth Context
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from "react-bootstrap";

const CreateJob = () => {
  const [title, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [type, setType] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [questions, setQuestions] = useState([{ id: 1, question: "" }]);
  const [loading, setLoading] = useState(false);
  const { hrId } = useAuth();
  // const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1, question: "" }]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, question: value } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const jobData = {
        title: title,
        description,
        salary: Number(salary), // Ensure salary is a number
        company_name: company, // Match backend field name
        skills,
        type,
        requirements,
        location,
        questions,
        hrId
      };
      const response = await addJob(jobData);
      toast.success("Job created successfully!");
      console.log(response.data);
      
      setJobTitle("");
      setDescription("");
      setSalary("");
      setCompany("");
      setSkills("");
      setType("");
      setRequirements("");
      setLocation("");
      setQuestions([{ id: 1, question: "" }]);
    } 
    catch (error) {
      console.error('Error creating job:', error);
      toast.error("Error creating job. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create Job</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Job Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Salary</Form.Label>
          <Form.Control
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Company</Form.Label>
          <Form.Control
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Skills</Form.Label>
          <Form.Control
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Type</Form.Label>
          <Form.Control
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Requirements</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>

        <h5>Interview Questions</h5>
        {questions.map((q, index) => (
          <Form.Group className="mb-3" key={q.id}>
            <Form.Label>Question {index + 1}</Form.Label>
            <Form.Control
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              required
            />
          </Form.Group>
        ))}

        <Button variant="secondary" onClick={handleAddQuestion} className="mb-3">
          Add Question
        </Button>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Job"}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateJob;