import { View, Text, ActivityIndicator } from 'react-native'
import NavigationGuard from '../components/NavigationGuard'
import { useAuth } from '../context/AuthContext'

export default function SplashScreen({ navigation }) {
  const { loading } = useAuth()

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-4xl font-bold text-orange-500">CheatSheet</Text>
        <Text className="text-4xl font-bold text-gray-800">AI</Text>
        <Text className="text-sm text-gray-400 mt-2">
          Rekomendasi Makan & Minum Terbaik
        </Text>
        {loading && (
          <ActivityIndicator
            size="small"
            color="#FF6B35"
            style={{ marginTop: 24 }}
          />
        )}
      </View>
      <NavigationGuard navigation={navigation} />
    </View>
  )
}