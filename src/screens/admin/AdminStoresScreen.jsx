import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useAuth } from '../../context/AuthContext'
import { useFocusEffect } from '@react-navigation/native'

export default function AdminStoresScreen({ navigation }) {
  const { user } = useAuth()
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchStores = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, 'stores'),
        where('adminUid', '==', user.uid)
      )
      const snapshot = await getDocs(q)
      setStores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data toko!')
    } finally {
      setLoading(false)
    }
  }

  // Refresh saat screen difokus
  useFocusEffect(
    useCallback(() => {
      fetchStores()
    }, [])
  )

  return (
    <View className="flex-1 bg-white">

      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Toko Saya</Text>
        </View>

        {/* Tombol Tambah */}
        <TouchableOpacity
          className="bg-orange-500 px-4 py-2 rounded-xl flex-row items-center"
          onPress={() => navigation.navigate('StoreSetup')}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text className="text-white font-semibold ml-1">Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      )}

      {/* Store List */}
      {!loading && (
        <ScrollView className="flex-1 px-6">
          {stores.length === 0 ? (
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-5xl mb-4">🏪</Text>
              <Text className="text-base text-gray-400 text-center mb-6">
                Belum ada toko
              </Text>
              <TouchableOpacity
                className="bg-orange-500 px-6 py-3 rounded-xl"
                onPress={() => navigation.navigate('StoreSetup')}
              >
                <Text className="text-white font-bold">Buat Toko</Text>
              </TouchableOpacity>
            </View>
          ) : (
            stores.map((store) => (
              <TouchableOpacity
                key={store.id}
                className="flex-row items-center bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100"
                onPress={() => navigation.navigate('AdminStoreDetail', { store })}
              >
                {/* Icon */}
                <View className="w-12 h-12 bg-orange-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="storefront-outline" size={22} color="#FF6B35" />
                </View>

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    {store.name}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    Dibuat: {new Date(store.createdAt).toLocaleDateString('id-ID')}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

    </View>
  )
}