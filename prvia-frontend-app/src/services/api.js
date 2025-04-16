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

  const userId = userResponse.data.id;
  if (userId === '0') {
    throw new Error('User creation failed');
  }

  // Step 2: Upload the CV
  const formData = new FormData();
  formData.append('file', applicationData.cv);
  
  // Log file details for debugging
  console.log('CV file details:', {
    name: applicationData.cv.name,
    type: applicationData.cv.type,
    size: applicationData.cv.size + ' bytes'
  });

  console.log('Submitting CV to /user/upload-CV for userId:', userId, 'jobId:', applicationData.jobId);
  try {
    const cvResponse = await api.put(`/user/upload-CV?jobId=${applicationData.jobId}&uid=${userId}`, formData, {
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

export const uploadVideo = async (videoResponseData, videoFile) => {
  const formData = new FormData();
  formData.append('file', videoFile);
   
  // Log file details for debugging
   console.log('Video file details:', {
    name: videoFile.name,
    type: videoFile.type,
    size: videoFile.size + ' bytes'
  });
  // Extract the parameters
  const { userId, questionId, jobId } = videoResponseData;
  console.log('Submitting video to /user/upload-video for userId:', userId, 'questionId:', questionId, 'jobId:', jobId);
  
  try {
    const videoResponse = await api.post(
      `/user/upload-video?userId=${userId}&questionId=${questionId}&jobId=${jobId}`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }
    );
    
    console.log('Response from /user/upload-video:', videoResponse.data);
    return { userId, videoResponse };
  } 
  catch (error) {
    console.error('Video upload error details:', error.response?.data);
    throw error;
  }

};

export const getJobById = (job_id) => {
  console.log('Fetching job by ID:', job_id);
  return api.get(`/job/get_job_info?job_id=${job_id}`);
};

export const computeScores = (data) => {
  console.log('Submitting compute-scores request:', data);
  const { hrId, userId, jobId } = data;
  // return api.post('/compute-scores', data);
  return api.post(`user/compute-scores?hrId=${hrId}&userId=${userId}&jobId=${jobId}`);

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

export const getUsersByJobId = (job_id, status) => {
  console.log('Fetching users for jobId:', job_id, 'with status:', status);
  return api.get('/user/', { params: { job_id, status } });
};

export const updateStatus = (data) => {
  const { userId, jobId, status } = data;
  console.log('Updating status for userId:', userId, 'jobId:', jobId, 'status:', status);
  return api.put(`/user/${userId}/status?job_id=${jobId}&new_status=${status}`);

};

export const getUserScores = (userId, jobId) => {
  console.log('Fetching scores for userId:', userId, 'jobId:', jobId);
  return api.get('/hr/get_user_scores', { params: { userId, jobId } });
};


// export const updateStatus = (data) => {
//   const { userId, jobId, status } = data;
//   console.log('Updating status for userId:', userId, 'jobId:', jobId, 'status:', status);
//   return api.put(`/user/${userId}/status`, { jobId, status });
// };
