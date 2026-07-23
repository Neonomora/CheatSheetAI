import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { getCurrentLocation, checkLocationPermission, requestLocationPermission, checkGPSEnabled } from '../services/locationService'

export default function LocationScreen({ navigation }) {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchLocation = async () => {
    try {
      setLoading(true)

      // Cek GPS
      const isGPSEnabled = await checkGPSEnabled()
      if (!isGPSEnabled) {
        Alert.alert('GPS Tidak Aktif', 'Aktifkan GPS di HP kamu terlebih dahulu.')
        setLoading(false)
        return
      }

      // Cek izin
      const hasPermission = await checkLocationPermission()
      if (!hasPermission) {
        const granted = await requestLocationPermission()
        if (!granted) {
          setLoading(false)
          return
        }
      }

      // Ambil koordinat
      const coords = await getCurrentLocation()
      if (coords) {
        setLocation(coords)
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mendapatkan lokasi!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocation()
  }, [])

  return (
    <View className="flex-1 bg-white">

      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity
          className="mr-3"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Lokasi Saya</Text>
      </View>

      {/* Loading */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text className="text-sm text-gray-400 mt-4">
            Mendapatkan lokasi kamu...
          </Text>
        </View>
      )}

      {/* Map */}
      {!loading && location && (
        <View className="flex-1">
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Lokasi Saya"
              pinColor="#FF6B35"
            />
          </MapView>

          {/* Refresh Button */}
          <TouchableOpacity
            className="absolute bottom-6 right-6 bg-orange-500 p-4 rounded-full"
            onPress={fetchLocation}
          >
            <Ionicons name="locate-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Error state */}
      {!loading && !location && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-5xl mb-4">📍</Text>
          <Text className="text-base text-gray-400 text-center mb-6">
            Gagal mendapatkan lokasi kamu
          </Text>
          <TouchableOpacity
            className="bg-orange-500 px-6 py-3 rounded-xl"
            onPress={fetchLocation}
          >
            <Text className="text-white font-bold">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  )
}