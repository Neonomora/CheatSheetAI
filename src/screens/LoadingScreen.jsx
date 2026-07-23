import { View, Text, ActivityIndicator } from 'react-native'
import useRedirect from '../hooks/useRedirect'

export default function LoadingScreen({ navigation }) {
  useRedirect(navigation)

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text className="text-sm text-gray-400 mt-4">
        Menyiapkan aplikasi...
      </Text>
    </View>
  )
}