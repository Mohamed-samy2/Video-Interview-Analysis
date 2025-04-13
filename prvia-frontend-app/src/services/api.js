import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Update to FastAPI port (default is 8000)
});

console.log('API baseURL:', api.defaults.baseURL);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    console.error('Request URL:', error.config?.url);
    console.error('Request Method:', error.config?.method);
    return Promise.reject(error);
  }
);

// User APIs:

export const getAllJobs = () => {
  return api.get('/jobs');
};

export const submitApplication = async (applicationData) => {
  // Step 1: Create the user
  const userData = {
    first_name: applicationData.firstName,
    last_name: applicationData.lastName,
    jobId: applicationData.jobId,
    email: applicationData.email,
    phone: applicationData.phoneNumber,
    gender: applicationData.gender,
    degree: applicationData.education,
  };

  console.log('Submitting user data to /user/create-user:', userData);
  const userResponse = await api.post('/user/create-user', userData);
  console.log('Response from /user/create-user:', userResponse.data);

  const userId = userResponse.data.response;
  if (userId === '0') {
    throw new Error('User creation failed');
  }

  // Step 2: Upload the CV
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('cv', applicationData.cv);

  console.log('Submitting CV to /user/upload-CV for userId:', userId);
  const cvResponse = await api.put('/user/upload-CV', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('Response from /user/upload-CV:', cvResponse.data);

  return { userId, cvResponse };
};

export const uploadVideo = (videoResponseData, videoFile) => {
  const formData = new FormData();
  formData.append('userId', videoResponseData.userId);
  formData.append('questionId', videoResponseData.questionId);
  formData.append('jobId', videoResponseData.jobId);
  formData.append('video', videoFile);

  console.log('Submitting video to /user/upload-video:', videoResponseData);
  return api.post('/user/upload-video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const computeScores = (data) => {
  console.log('Submitting compute-scores request:', data);
  return api.post('/compute-scores', data);
};

export const getJobById = (id) => {
  console.log('Fetching job by ID:', id);
  return api.get(`/jobs/${id}`);
};

// HR APIs:

export const getJobs = (hrId) => {
  console.log('Fetching jobs for hrId:', hrId);
  return api.get(`/jobs/`, { params: { hrId } });
};

export const addJob = (jobData) => {
  console.log('Creating new job:', jobData);
  return api.post('/jobs', jobData);
};

export const addHr = (userData) => {
  console.log('Creating new HR:', userData);
  return api.post('/create', userData);
};

export const loginHr = (credentials) => {
  console.log('Logging in HR:', credentials);
  return api.post('/login', credentials);
};


export const getUsersByJobId = (jobId, status) => {
  console.log('Fetching users for jobId:', jobId, 'with status:', status);
  return api.get('/user/', { params: { jobId, status } });
};

export const updateStatus = (data) => {
  const { userId, jobId, status } = data;
  console.log('Updating status for userId:', userId, 'jobId:', jobId, 'status:', status);
  return api.put(`/user/${userId}/status`, { jobId, status });
};

export const getUserScores = (userId, jobId) => {
  console.log('Fetching scores for userId:', userId, 'jobId:', jobId);
  return api.get('/hr/get_user_scores', { params: { userId, jobId } });
};

export const getVideosByUserAndJob = (userId, jobId) => {
  console.log('Fetching videos for userId:', userId, 'jobId:', jobId);
  return api.get('/videos', { params: { userId, jobId } });
};


// export const getHRJobs = (hrId) => {
//   console.log('Fetching HR jobs for hrId:', hrId);
//   return api.get(`/jobs`, { params: { hrId } });
// };
// export const getUsersByJobId = (jobId) => {
//   console.log('Fetching users for jobId:', jobId);
//   return api.get('/user/', { params: { jobId } });
// };

