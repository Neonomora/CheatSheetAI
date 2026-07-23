import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useAuth } from '../../context/AuthContext'
import { CommonActions } from '@react-navigation/native'

export default function StoreSetupScreen({ navigation }) {
  const { user } = useAuth()
  const [storeName, setStoreName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateStore = async () => {
    if (!storeName.trim()) {
      Alert.alert('Error', 'Nama toko harus diisi!')
      return
    }

    try {
      setLoading(true)

      // Cek apakah nama toko sudah dipakai
      const q = query(
        collection(db, 'stores'),
        where('name', '==', storeName.trim())
      )
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        Alert.alert('Error', 'Nama toko sudah digunakan, pilih nama lain!')
        return
      }

      // Buat toko baru
      await addDoc(collection(db, 'stores'), {
        name: storeName.trim(),
        adminUid: user.uid,
        createdAt: new Date().toISOString(),
      })

      // Masuk ke Admin Dashboard
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AdminDashboard' }],
        })
      )
    } catch (error) {
      Alert.alert('Error', 'Gagal membuat toko, coba lagi!')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-white px-6 justify-center">

      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-1">
          Buat Toko 🏪
        </Text>
        <Text className="text-sm text-gray-400">
          Buat toko pertama kamu untuk mulai mengelola menu
        </Text>
      </View>

      {/* Input Nama Toko */}
      <Text className="text-sm font-semibold text-gray-700 mb-2">
        Nama Toko
      </Text>
      <TextInput
        className="border border-gray-200 rounded-xl px-4 py-3 mb-2 text-gray-800"
        placeholder="contoh: Warung Pak Budi"
        placeholderTextColor="#BBBBBB"
        value={storeName}
        onChangeText={setStoreName}
      />
      <Text className="text-xs text-gray-400 mb-6">
        Nama toko harus unik dan tidak bisa diubah setelah dibuat
      </Text>

      {/* Tombol Buat */}
      <TouchableOpacity
        className="bg-orange-500 py-4 rounded-2xl items-center"
        onPress={handleCreateStore}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#FFFFFF" />
          : <Text className="text-white font-bold text-base">Buat Toko</Text>
        }
      </TouchableOpacity>

    </View>
  )
}