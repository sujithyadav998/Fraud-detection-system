import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../theme';
import api from '../config/api';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting signup with:', { email, password, fullName });
      await api.post('/auth/signup', { email, password });
      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Signup Failed', error.response?.data?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
      <SafeAreaView>
        <View className="flex-row justify-center">
          <Image source={require('../assets/images/signupimg.png')} style={{ width: 325, height: 110 }} />
        </View>
      </SafeAreaView>
      <View className="flex-1 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          className="p-4 bg-gray-100 rounded-2xl mb-3"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="p-4 bg-gray-100 rounded-2xl mb-3"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="p-4 bg-gray-100 rounded-2xl mb-7"
        />
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          className={`py-3 rounded-xl ${loading ? 'bg-blue-300' : 'bg-blue-500'}`}>
          <Text className="font-xl font-bold text-center text-white">{loading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
