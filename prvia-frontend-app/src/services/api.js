import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
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
  return api.get('/job/get_jobs');
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
  formData.append('uid', userId);
  formData.append('jobId', applicationData.jobId); // Add job ID to the form data
  formData.append('file', applicationData.cv);
  // Log file details for debugging
  console.log('CV file details:', {
    name: applicationData.cv.name,
    type: applicationData.cv.type,
    size: applicationData.cv.size + ' bytes'
  });

  console.log('Submitting CV to /user/upload-CV for userId:', userId, 'jobId:', applicationData.jobId);
  try {
    const cvResponse = await api.put('/user/upload-CV', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Remove any content-length header that might be auto-added
        'Content-Length': undefined,
      },
    });
    console.log('Response from /user/upload-CV:', cvResponse.data);
    return { userId, cvResponse };
  } 
  catch (error) {
    console.error('CV upload error details:', error.response?.data);
    throw error;
  }
};

export const uploadVideo = (videoResponseData, videoFile) => {
  const formData = new FormData();
  formData.append('userId', videoResponseData.userId);
  formData.append('questionId', videoResponseData.questionId);
  formData.append('jobId', videoResponseData.jobId);
  formData.append('file', videoFile);

  console.log('Submitting video to /user/upload-video:', videoResponseData);
  return api.post('/user/upload-video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getJobById = (job_id) => {
  console.log('Fetching job by ID:', job_id);
  return api.get(`/job/get_job_info?job_id=${job_id}`);
};

// HR APIs:

export const getJobs = (HRId) => {
  console.log('Fetching jobs for hrId:', HRId);
  return api.get(`/job/get_jobs_HRId`, { params: { HRId } });
};


export const addJob = (jobData) => {
  console.log('Creating new job:', jobData);
  return api.post('/job/create_job', jobData);
};

export const addHr = (userData) => {
  console.log('Creating new HR:', userData);
  return api.post('hr/create', userData);
};

export const loginHr = (credentials) => {
  console.log('Logging in HR:', credentials);
  return api.post('hr/login', credentials);
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


// export const computeScores = (data) => {
//   console.log('Submitting compute-scores request:', data);
//   return api.post('/compute-scores', data);
// };