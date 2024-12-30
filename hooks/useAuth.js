import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);

      const { token } = response.data;
      if (!token) {
        throw new Error('No token received from server');
      }

      await AsyncStorage.setItem('token', token);
      console.log('Saved token in AsyncStorage:', await AsyncStorage.getItem('token'));

      const userDetails = await api.get('/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched user details:', userDetails.data);

      setUser(userDetails.data);
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    console.log('Logging out user...');
    await AsyncStorage.removeItem('token');
    setUser(null);
    console.log('User logged out successfully.');
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Fetched token from AsyncStorage:', token);

      if (token) {
        const userDetails = await api.get('/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched user details on app launch:', userDetails.data);

        setUser(userDetails.data);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      await AsyncStorage.removeItem('token'); 
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('Current user state updated:', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
