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
import { AuthGuard } from './src/components/AuthGuard';

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
              options={{ title: 'TCF Simulator' }}
            >
              {(props) => (
                <AuthGuard>
                  <HomeScreen {...props} />
                </AuthGuard>
              )}
            </Stack.Screen>
            <Stack.Screen 
              name="Test" 
              options={{ 
                title: 'Test TCF',
                headerLeft: () => null, // Prevent going back during test
                gestureEnabled: false
              }}
            >
              {(props) => (
                <AuthGuard>
                  <TestScreen {...props} />
                </AuthGuard>
              )}
            </Stack.Screen>
            <Stack.Screen 
              name="Results" 
              options={{ title: 'Résultats' }}
            >
              {(props) => (
                <AuthGuard>
                  <ResultsScreen {...props} />
                </AuthGuard>
              )}
            </Stack.Screen>
            <Stack.Screen 
              name="Admin" 
              options={{ title: 'Administration' }}
            >
              {(props) => (
                <AuthGuard requireAdmin>
                  <AdminScreen {...props} />
                </AuthGuard>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </TestProvider>
    </AuthProvider>
  );
}