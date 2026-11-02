import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchBugs = (signal) => api.get('/bugs', { signal });
export const addBug = (bug) => api.post('/bugs', bug);
export const updateBug = (id, updatedBug) => api.put(`/bugs/${id}`, updatedBug);
export const deleteBug = (id) => api.delete(`/bugs/${id}`);
export const shareBug = (id, email) => api.post(`/bugs/${id}/share`, { email }); // Новый метод