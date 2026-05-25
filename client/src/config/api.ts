import axios from 'axios';

// Create Axios instance with base URL from environment variables
const API = axios.create({
   baseURL: "http://localhost:5000/api"
});
// Request interceptor: Inject JWT token into every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('o token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle authentication errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error status is 401 (Unauthorized)
    if (error.response?.status === 401) {
    // Clear authentication data from local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      // Redirect to login page if not already there
      const isAuthPage = window.location.pathname.includes('/login') || 
                         window.location.pathname.includes('/register');
      
      if (!isAuthPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;