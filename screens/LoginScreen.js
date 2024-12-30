import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useAuth } from '../hooks/useAuth'; 
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../theme';

export default function LoginScreen() {
  const { login } = useAuth(); 
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email, password });
      await login(email, password); 
      console.log('Login successful, navigating to Home');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
      <SafeAreaView>
        <View className="flex-row justify-start">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image source={require('../assets/images/loginimg.png')} style={{ width: 220, height: 200 }} />
        </View>
      </SafeAreaView>

      <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }} className="flex-1 bg-white px-8 pt-8">
        {errorMessage ? <Text className="text-red-500 text-center mb-2">{errorMessage}</Text> : null}
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Email Address</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
            secureTextEntry
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`py-3 rounded-xl ${loading ? 'bg-blue-300' : 'bg-blue-500'}`}>
            <Text className="text-xl font-bold text-center text-white">{loading ? 'Logging In...' : 'Login'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
