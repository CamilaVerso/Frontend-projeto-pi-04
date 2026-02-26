import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-rede-cegonha.onrender.com', 
  withCredentials: true,
});

export default api;
