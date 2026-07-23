import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CommonActions } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'

export default function SuperAdminDashboardScreen({ navigation }) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    Alert.alert('Logout', 'Yakin mau keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout()
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            })
          )
        }
      }
    ])
  }

  const menus = [
    {
      title: 'Kelola Filter',
      description: 'Tambah, edit, hapus filter makanan & minuman',
      icon: 'options-outline',
      screen: 'AdminFilters',
      color: '#FF6B35',
      bgColor: '#FFF0EB',
    },
    {
      title: 'Kelola User',
      description: 'Lihat semua user yang terdaftar',
      icon: 'people-outline',
      screen: 'AdminUsers',
      color: '#007AFF',
      bgColor: '#EBF4FF',
    },
  ]

  return (
    <View className="flex-1 bg-white">

      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-gray-400">Selamat datang, ⚡</Text>
          <Text className="text-2xl font-bold text-gray-800">
            {user?.displayName || 'Super Admin'}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-gray-100 p-2 rounded-xl"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#888888" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">

        {/* Info Card */}
        <View className="bg-orange-50 rounded-2xl p-4 mb-6">
          <Text className="text-sm font-semibold text-orange-500 mb-1">
            Super Admin Dashboard
          </Text>
          <Text className="text-xs text-gray-400">
            Kelola filter dan user aplikasi CheatSheetAI
          </Text>
        </View>

        {/* Menu */}
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          Menu Utama
        </Text>

        {menus.map((menu, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100"
            onPress={() => navigation.navigate(menu.screen)}
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: menu.bgColor }}
            >
              <Ionicons name={menu.icon} size={22} color={menu.color} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800 mb-1">
                {menu.title}
              </Text>
              <Text className="text-xs text-gray-400">
                {menu.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
          </TouchableOpacity>
        ))}

      </ScrollView>

    </View>
  )
}