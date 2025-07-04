import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

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

  const userResponse = await api.post('/user/create-user', userData);

  const userId = userResponse.data.id;
  if (userId === '0') {
    throw new Error('User creation failed');
  }

  // Step 2: Upload the CV
  const formData = new FormData();
  formData.append('file', applicationData.cv);

  // Log file details for debugging
  // console.log('CV file details:', {
  //   name: applicationData.cv.name,
  //   type: applicationData.cv.type,
  //   size: applicationData.cv.size + ' bytes'
  // });

  try {
    const cvResponse = await api.put(`/user/upload-CV?jobId=${applicationData.jobId}&uid=${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Remove any content-length header that might be auto-added
        'Content-Length': undefined,
      },
    });

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

  // console.log('Video file details:', {
  //   name: videoFile.name,
  //   type: videoFile.type,
  //   size: videoFile.size + ' bytes'
  // });
  // Extract the parameters
  const { userId, questionId, jobId } = videoResponseData;

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

    return { userId, videoResponse };
  }
  catch (error) {
    console.error('Video upload error details:', error.response?.data);
    throw error;
  }

};

export const getJobById = (job_id) => {
  return api.get(`/job/get_job_info?job_id=${job_id}`);
};


// HR APIs:
export const computeScores = (data) => {
  return api.post(`hr/compute_scores`, data);
};

export const getJobs = (HRId) => {
  return api.get(`/job/get_jobs_HRId`, { params: { HRId } });
};

export const addJob = (jobData) => {
  return api.post('/job/create_job', jobData);
};

export const addHr = (userData) => {
  return api.post('hr/create', userData);
};

export const loginHr = (credentials) => {
  return api.post('hr/login', credentials);
};

export const getUsersByJobId = (job_id, status) => {
  return api.get('/user/', { params: { job_id, status } });
};

export const updateStatus = (data) => {
  const { userId, jobId, status } = data;
  return api.put(`/user/${userId}/status?job_id=${jobId}&new_status=${status}`);

};

export const getUserScores = (data) => {
  return api.post("/hr/get_user_scores", data);

  //   return api.get('/hr/get_user_scores', {
  //     user_id: parseInt(user_id),
  //     job_id: parseInt(job_id)
  //   });
};


// export const updateStatus = (data) => {
//   const { userId, jobId, status } = data;
//   console.log('Updating status for userId:', userId, 'jobId:', jobId, 'status:', status);
//   return api.put(`/user/${userId}/status`, { jobId, status });
// };
