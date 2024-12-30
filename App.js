import React from 'react';
import { AuthProvider } from './hooks/useAuth';
import AppNavigation from './navigation/appNavigation';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}
