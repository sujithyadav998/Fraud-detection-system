import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.29.148:3000', // Ensure this is correct
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
