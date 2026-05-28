import axios from 'axios';

// Helper function to get token from local storage
const getTokenFromLocalStorage = (name: string): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(name);
    return token;
  }
  return null;
};


const getBaseURL = () => {
  let url = '';
  if (typeof window !== 'undefined') {
    url = localStorage.getItem('NEXT_PUBLIC_API_BASE_URL') || process.env.NEXT_PUBLIC_API_BASE_URL || '';
  } else {
    url = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }
  
  if (url && !url.startsWith('http')) {
    url = `https://${url}`;
  }
  return url;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

API.interceptors.request.use((config:any) => {
  if (typeof window !== 'undefined') {
    const dynamicBaseURL = getBaseURL();
    if (dynamicBaseURL) {
      config.baseURL = dynamicBaseURL;
    }
    const token = getTokenFromLocalStorage('access_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
},
(error:any) => {
  return Promise.reject(error);
});

export default API;
