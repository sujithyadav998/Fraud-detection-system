import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.29.148:3000', // Replace with your machine's IP and backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;