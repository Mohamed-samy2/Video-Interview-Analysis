// src/services/api.js
import axios from 'axios';

const api =  axios.create({
  baseURL: process.env.BACKEND_API_URL, 
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    console.error('Request URL:', error.config?.url);
    console.error('Request Method:', error.config?.method);
    return Promise.reject(error);
  }
);

// Fetch Jobs (using hrId)
export const getJobs = (hrId) => {
  return api.get(`/jobs/`, { params: { hrId } });
};

// Fetch Job by ID
export const getJobById = (id) => {
  return api.get(`/jobs/${id}`);
};

//  Create a New Job
export const addJob = (jobData) => {
  return api.post('/jobs', jobData);
};

//  Add a New User (Sign up)
export const addHr = (userData) => {
  return api.post('/create', userData);
};

// Send user data for login check
export const loginHr = (credentials) => {
  return api.post('/login', credentials); // Add login endpoint for FastAPI
};

// Get Jobs for logged in HR
export const getHRJobs = (hrId) => {
  // const hrId = localStorage.getItem('hrId');
  return api.get(`/jobs`, { params: { hrId } });
};

// Get Hr info 
export const getHRDetails = (hrId) => {
  return api.get(`/hr/${hrId}`); // Confirm endpoint with backend
};





