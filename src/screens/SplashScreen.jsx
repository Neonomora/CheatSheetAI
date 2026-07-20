import { View, Text } from 'react-native'
import NavigationGuard from '../components/NavigationGuard'

export default function SplashScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">

      {/* Konten Tengah */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-4xl font-bold text-orange-500">CheatSheet</Text>
        <Text className="text-4xl font-bold text-gray-800">AI</Text>
        <Text className="text-sm text-gray-400 mt-2">
          Rekomendasi Makan & Minum Terbaik
        </Text>
      </View>

      {/* NavigationGuard — tidak terlihat, hanya logic */}
      <View className="absolute">
        <NavigationGuard navigation={navigation} />
      </View>

    </View>
  )
}