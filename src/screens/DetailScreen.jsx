import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Alert } from "react-native";
import { getCurrentLocation } from "../services/locationService";

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params;
  const handleLocation = async () => {
    try {
      // Ambil koordinat GPS user
      const coords = await getCurrentLocation();

      if (!coords) {
        Alert.alert("Error", "Gagal mendapatkan lokasi kamu. Coba lagi!");
        return;
      }

      // Buka Google Maps dengan koordinat user + nama makanan
      const query = encodeURIComponent(item.name);
      const url = `https://www.google.com/maps/search/${query}/@${coords.latitude},${coords.longitude},14z`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Google Maps tidak tersedia!");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal membuka maps. Coba lagi!");
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity className="mr-3" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Detail</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Nama */}
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          {item.name}
        </Text>

        {/* Deskripsi */}
        <Text className="text-sm text-gray-400 leading-6 mb-6">
          {item.description}
        </Text>

        {/* Info Card */}
        <View className="bg-gray-50 rounded-2xl p-4 mb-6">
          {/* Harga */}
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="pricetag-outline" size={16} color="#FF6B35" />
            </View>
            <View>
              <Text className="text-xs text-gray-400">Estimasi Harga</Text>
              <Text className="text-sm font-semibold text-gray-800">
                {item.price}
              </Text>
            </View>
          </View>

          {/* Lokasi */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="location-outline" size={16} color="#FF6B35" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-400">Lokasi Umum</Text>
              <Text className="text-sm font-semibold text-gray-800">
                {item.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Tombol Cari Lokasi */}
        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-2xl items-center flex-row justify-center mb-4"
          onPress={handleLocation}
        >
          <Ionicons name="map-outline" size={18} color="#FFFFFF" />
          <Text className="text-white font-bold text-base ml-2">
            Cari Lokasi Terdekat
          </Text>
        </TouchableOpacity>

        {/* Tombol Kembali ke Result */}
        <TouchableOpacity
          className="border border-gray-200 py-4 rounded-2xl items-center mb-6"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-gray-400 font-semibold">
            Kembali ke Rekomendasi
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
