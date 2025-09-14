import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { TestProvider } from './src/contexts/TestContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import TestScreen from './src/screens/TestScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import AdminScreen from './src/screens/AdminScreen';
import UserManagementScreen from './src/screens/UserManagementScreen';
import ProtectedRoute from './src/components/ProtectedRoute';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <TestProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2563eb',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ 
                title: 'TCF Simulator',
                headerLeft: () => null,
                gestureEnabled: false
              }}
            />
            <Stack.Screen 
              name="Test" 
              component={TestScreen}
              options={{ 
                title: 'Test en cours',
                headerLeft: () => null,
                gestureEnabled: false
              }}
            />
            <Stack.Screen 
              name="Results" 
              component={ResultsScreen}
              options={{ 
                title: 'Résultats',
                headerLeft: () => null,
                gestureEnabled: false
              }}
            />
            <Stack.Screen 
              name="Admin" 
              component={AdminScreen}
              options={{ title: 'Administration' }}
            />
            <Stack.Screen 
              name="UserManagement" 
              component={UserManagementScreen}
              options={{ title: 'Gestion Utilisateurs' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TestProvider>
    </AuthProvider>
  );
}