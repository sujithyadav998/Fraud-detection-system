import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

export default function useAuth() {
  const [user, setUser] = useState(null); // Holds logged-in user info

  // Fetch the token and user when the app starts
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Fetch token from storage
        if (token) {
          api.defaults.headers.Authorization = `Bearer ${token}`; // Attach token to all requests
          const response = await api.get('/auth/user'); // Fetch user info from backend
          setUser(response.data); // Set user info in state
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        await AsyncStorage.removeItem('token'); // Clear token if invalid
      }
    };
    fetchToken();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser({ email });
    } catch (error) {
      console.error('Login Error:', error);
      throw error.response?.data?.message || 'Unable to log in';
    }
  };

  // Logout function
  const logout = async () => {
    await AsyncStorage.removeItem('token'); // Remove token from storage
    delete api.defaults.headers.Authorization; // Remove token from headers
    setUser(null); // Clear user info
  };

  return { user, login, logout };
}
