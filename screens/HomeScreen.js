import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen() {
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    type: '',
    oldBalance: '',
    newBalance: ''
  });
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.0.103:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          amount: formData.amount,
          oldbalanceOrg: formData.oldBalance,
          newbalanceOrig: formData.newBalance
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ success: false, message: 'Error connecting to server' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={logout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.title}>Transaction Form</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={formData.amount}
          onChangeText={(text) => setFormData({ ...formData, amount: text })}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Type"
          value={formData.type}
          onChangeText={(text) => setFormData({ ...formData, type: text })}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Old Balance"
          value={formData.oldBalance}
          onChangeText={(text) => setFormData({ ...formData, oldBalance: text })}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="New Balance"
          value={formData.newBalance}
          onChangeText={(text) => setFormData({ ...formData, newBalance: text })}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={[
              styles.resultText,
              { color: result.success ? (result.prediction === 1 ? 'red' : 'green') : 'red' }
            ]}>
              {result.success ? result.message : result.error}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
