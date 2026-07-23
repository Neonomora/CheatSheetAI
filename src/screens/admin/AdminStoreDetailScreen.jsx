import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { useState, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { collection, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useFocusEffect } from '@react-navigation/native'

export default function AdminStoreDetailScreen({ route, navigation }) {
  const { store } = route.params
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('food')

  const fetchMenus = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, 'stores', store.id, 'menus'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      setMenus(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data menu!')
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchMenus()
    }, [])
  )

  const handleDelete = (item) => {
    Alert.alert(
      'Hapus Menu',
      `Yakin mau hapus "${item.name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'stores', store.id, 'menus', item.id))
              fetchMenus()
            } catch (error) {
              Alert.alert('Error', 'Gagal hapus menu!')
            }
          }
        }
      ]
    )
  }

  const filteredMenus = menus.filter(m => m.category === category)

  return (
    <View className="flex-1 bg-white">

      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-gray-800">{store.name}</Text>
            <Text className="text-xs text-gray-400">{menus.length} menu tersedia</Text>
          </View>
        </View>

        {/* Tombol Tambah */}
        <TouchableOpacity
          className="bg-orange-500 px-4 py-2 rounded-xl flex-row items-center"
          onPress={() => navigation.navigate('AdminMenuForm', { store, onRefresh: fetchMenus })}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text className="text-white font-semibold ml-1">Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Kategori */}
      <View className="flex-row px-6 mb-4">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl mr-2 items-center ${category === 'food' ? 'bg-orange-500' : 'bg-gray-100'}`}
          onPress={() => setCategory('food')}
        >
          <Text className={`font-semibold ${category === 'food' ? 'text-white' : 'text-gray-400'}`}>
            🍽️ Makanan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl ml-2 items-center ${category === 'drink' ? 'bg-orange-500' : 'bg-gray-100'}`}
          onPress={() => setCategory('drink')}
        >
          <Text className={`font-semibold ${category === 'drink' ? 'text-white' : 'text-gray-400'}`}>
            🥤 Minuman
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      )}

      {/* Menu List */}
      {!loading && (
        <ScrollView className="flex-1 px-6">
          {filteredMenus.length === 0 ? (
            <View className="items-center justify-center mt-20">
              <Text className="text-5xl mb-4">🍽️</Text>
              <Text className="text-base text-gray-400 text-center mb-6">
                Belum ada menu {category === 'food' ? 'makanan' : 'minuman'}
              </Text>
              <TouchableOpacity
                className="bg-orange-500 px-6 py-3 rounded-xl"
                onPress={() => navigation.navigate('AdminMenuForm', { store, onRefresh: fetchMenus })}
              >
                <Text className="text-white font-bold">Tambah Menu</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredMenus.map((item) => (
              <View
                key={item.id}
                className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100"
              >
                {/* Nama & Harga */}
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-base font-bold text-gray-800 flex-1 mr-2">
                    {item.name}
                  </Text>
                  <Text className="text-sm font-semibold text-orange-500">
                    {item.price}
                  </Text>
                </View>

                {/* Lokasi */}
                <View className="flex-row items-center mb-2">
                  <Ionicons name="location-outline" size={14} color="#888888" />
                  <Text className="text-xs text-gray-400 ml-1" numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>

                {/* Filter Tags */}
                <View className="flex-row flex-wrap mb-3">
                  {item.filters?.map((filter, index) => (
                    <View key={index} className="bg-orange-50 px-2 py-1 rounded-lg mr-1 mb-1">
                      <Text className="text-xs text-orange-500">{filter}</Text>
                    </View>
                  ))}
                </View>

                {/* Tombol Edit & Hapus */}
                <View className="flex-row justify-end">
                  <TouchableOpacity
                    className="bg-blue-50 px-3 py-2 rounded-lg flex-row items-center mr-2"
                    onPress={() => navigation.navigate('AdminMenuForm', {
                      store,
                      item,
                      onRefresh: fetchMenus
                    })}
                  >
                    <Ionicons name="pencil-outline" size={14} color="#007AFF" />
                    <Text className="text-xs text-blue-500 ml-1 font-semibold">Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-red-50 px-3 py-2 rounded-lg flex-row items-center"
                    onPress={() => handleDelete(item)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#FF3B30" />
                    <Text className="text-xs text-red-500 ml-1 font-semibold">Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

    </View>
  )
}