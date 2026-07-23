import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { useState, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useFocusEffect } from '@react-navigation/native'

export default function AdminUsersScreen({ navigation }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data user!')
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUsers()
    }, [])
  )

  const handleChangeRole = (user) => {
    const roles = ['user', 'admin', 'superadmin']
    const currentIndex = roles.indexOf(user.role)
    const otherRoles = roles.filter(r => r !== user.role)

    Alert.alert(
      'Ubah Role',
      `Ubah role "${user.username}" dari "${user.role}" menjadi:`,
      [
        ...otherRoles.map(role => ({
          text: role,
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', user.id), { role })
              fetchUsers()
            } catch (error) {
              Alert.alert('Error', 'Gagal ubah role!')
            }
          }
        })),
        { text: 'Batal', style: 'cancel' }
      ]
    )
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return { label: '⚡ Super Admin', bg: 'bg-purple-50', text: 'text-purple-500' }
      case 'admin':
        return { label: '👑 Admin', bg: 'bg-orange-50', text: 'text-orange-500' }
      default:
        return { label: '👤 User', bg: 'bg-gray-100', text: 'text-gray-500' }
    }
  }

  return (
    <View className="flex-1 bg-white">

      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-gray-800">Kelola User</Text>
            <Text className="text-xs text-gray-400">{users.length} user terdaftar</Text>
          </View>
        </View>

        {/* Refresh */}
        <TouchableOpacity
          className="bg-gray-100 p-2 rounded-xl"
          onPress={fetchUsers}
        >
          <Ionicons name="refresh-outline" size={22} color="#888888" />
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      )}

      {/* User List */}
      {!loading && (
        <ScrollView className="flex-1 px-6">
          {users.length === 0 ? (
            <View className="items-center justify-center mt-20">
              <Text className="text-5xl mb-4">👥</Text>
              <Text className="text-base text-gray-400 text-center">
                Belum ada user terdaftar
              </Text>
            </View>
          ) : (
            users.map((user) => {
              const badge = getRoleBadge(user.role)
              return (
                <View
                  key={user.id}
                  className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100"
                >
                  {/* Baris atas — avatar + info + badge */}
                  <View className="flex-row items-center mb-3">
                    {/* Avatar */}
                    <View className="w-10 h-10 bg-orange-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-base font-bold text-white">
                        {user.username?.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-gray-800">
                        {user.username}
                      </Text>
                      <Text className="text-xs text-gray-400" numberOfLines={1}>
                        {user.email}
                      </Text>
                    </View>

                    {/* Badge Role */}
                    <View className={`px-2 py-1 rounded-lg ${badge.bg}`}>
                      <Text className={`text-xs font-semibold ${badge.text}`}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  {/* Baris bawah — tanggal + tombol ubah role */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-400">
                      Daftar: {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </Text>

                    <TouchableOpacity
                      className="bg-orange-50 px-3 py-1 rounded-lg"
                      onPress={() => handleChangeRole(user)}
                    >
                      <Text className="text-xs text-orange-500 font-semibold">
                        Ubah Role
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
          )}
        </ScrollView>
      )}

    </View>
  )
}