const API_BASE_URL = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000';

export const getServerUrl = (path) => {
  if (!path) return '';
  // If the path is already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Otherwise, prefix with the API base URL
  return `${API_BASE_URL}${path}`;
};