import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./src/context/AuthContext";

import SplashScreen from "./src/screens/SplashScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AdminDashboardScreen from "./src/screens/AdminDashboardScreen";
import ResultScreen from "./src/screens/ResultScreen";
import DetailScreen from "./src/screens/DetailScreen";
import { useEffect } from "react";
import { requestLocationPermission } from "./src/services/locationService";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import LocationScreen from "./src/screens/LocationScreen";
import AdminFiltersScreen from "./src/screens/admin/AdminFiltersScreen";
import AdminUsersScreen from "./src/screens/admin/AdminUsersScreen";
import AdminFilterFormScreen from "./src/screens/admin/AdminFilterFormScreen";
import StoreSetupScreen from "./src/screens/admin/StoreSetupScreen";
import SuperAdminDashboardScreen from "./src/screens/superadmin/SuperAdminDashboardScreen";
import AdminStoresScreen from "./src/screens/admin/AdminStoresScreen";
import AdminStoreDetailScreen from "./src/screens/admin/AdminStoreDetailScreen";
import AdminMenuFormScreen from "./src/screens/admin/AdminMenuFormScreen";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
          />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="AdminFilters" component={AdminFiltersScreen} />
          <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
          <Stack.Screen
            name="AdminFilterForm"
            component={AdminFilterFormScreen}
          />
          <Stack.Screen name="StoreSetup" component={StoreSetupScreen} />
          <Stack.Screen
            name="SuperAdminDashboard"
            component={SuperAdminDashboardScreen}
          />
          <Stack.Screen name="AdminStores" component={AdminStoresScreen} />
          <Stack.Screen
            name="AdminStoreDetail"
            component={AdminStoreDetailScreen}
          />
          <Stack.Screen name="AdminMenuForm" component={AdminMenuFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
