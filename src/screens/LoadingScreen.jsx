import { View, Text, ActivityIndicator } from 'react-native'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoadingScreen({ navigation }) {
  const { user, role, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!user) {
      navigation.replace('Onboarding')
    } else if (role === 'admin') {
      navigation.replace('AdminDashboard')
    } else {
      navigation.replace('Home')
    }
  }, [user, role, loading])

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text className="text-sm text-gray-400 mt-4">
        Menyiapkan aplikasi...
      </Text>
    </View>
  )
}