import './global.css'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthProvider } from './src/context/AuthContext'

import SplashScreen from './src/screens/SplashScreen'
import OnboardingScreen from './src/screens/OnboardingScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import LoginScreen from './src/screens/LoginScreen'
import HomeScreen from './src/screens/HomeScreen'
import AdminDashboardScreen from './src/screens/AdminDashboardScreen'
import ResultScreen from './src/screens/ResultScreen'
import DetailScreen from './src/screens/DetailScreen'
import { useEffect } from 'react'
import { requestLocationPermission } from './src/services/locationService'
import ProfileScreen from './src/screens/ProfileScreen'

const Stack = createStackNavigator()

export default function App() {
  useEffect(() => {
    requestLocationPermission()
  }, [])

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  )
}