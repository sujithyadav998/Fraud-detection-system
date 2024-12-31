import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.103:3000', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
