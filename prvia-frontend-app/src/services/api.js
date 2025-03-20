// src/services/api.js
import axios from 'axios';

const api =  axios.create({
  baseURL: process.env.BACKEND_API_URL, 
});

// Fetch Jobs (using hrId)
export const getJobs = (hrId) => {
  return api.get(`/api/jobs/`, { params: { hrId } });
};

// Fetch Job by ID
export const getJobById = (id) => {
  return api.get(`/api/jobs/${id}`);
};

//  Create a New Job
export const addJob = (jobData) => {
  return api.post('/api/jobs', jobData);
};

//  Add a New User (Sign up)
export const addHr = (userData) => {
  return api.post('/api/create', userData);
};

// Send user data for login check
export const loginHr = (credentials) => {
  return api.post('/login', credentials); // Add login endpoint for FastAPI
};

// Get Jobs for logged in HR
export const getHRJobs = (hrId) => {
  // const hrId = localStorage.getItem('hrId');
  return api.get(`/api/jobs`, { params: { hrId } });
};

// Get Hr info 
export const getHRDetails = async (hrId) => {
  return await axios.get(`/api/hr/${hrId}`); // Adjust API endpoint based on backend
};






