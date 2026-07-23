import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { getFilters } from "../services/filterService";
import {
  checkLocationPermission,
  requestLocationPermission,
  checkGPSEnabled,
} from "../services/locationService";

export default function HomeScreen({ navigation }) {
  const [category, setCategory] = useState("food"); // 'food' atau 'drink'
  const [selectedFilters, setSelectedFilters] = useState([]); // multiple select
  const [search, setSearch] = useState("");
  const { user, logout, loading } = useAuth();
  const [filters, setFilters] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      setFiltersLoading(true);
      const data = await getFilters(category);
      setFilters(data);
      setFiltersLoading(false);
    };
    fetchFilters();
  }, [category]);

  const handleRecommend = async () => {
    if (selectedFilters.length === 0 && !search) {
      alert("Pilih filter atau masukkan pencarian dulu!");
      return;
    }

    // Cek GPS aktif
    const isGPSEnabled = await checkGPSEnabled();
    if (!isGPSEnabled) {
      Alert.alert(
        "GPS Tidak Aktif",
        "Aktifkan GPS/Lokasi di HP kamu terlebih dahulu untuk melanjutkan.",
        [{ text: "Oke" }],
      );
      return;
    }

    // Cek izin lokasi
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return;
    }

    navigation.navigate("Result", {
      category,
      filters: selectedFilters,
      search,
    });
  };

  const toggleFilter = (item) => {
    const exists = selectedFilters.find((f) => f.id === item.id);
    if (exists) {
      setSelectedFilters(selectedFilters.filter((f) => f.id !== item.id));
    } else {
      setSelectedFilters([...selectedFilters, item]);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //   } catch (error) {
  //     alert("Gagal logout, coba lagi!");
  //   }
  // };

  useEffect(() => {
    const hasAuthUser = !!auth.currentUser;
    if (!loading && !user && !hasAuthUser) {
      navigation.replace("Onboarding");
    }
  }, [user, loading]);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      {/* Header */}
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-gray-400">Halo, 👋</Text>
          <Text className="text-2xl font-bold text-gray-800">
            {user?.displayName || "Pengguna"}
          </Text>
          <Text className="text-sm text-gray-400 mt-1">
            Mau makan atau minum apa hari ini?
          </Text>
        </View>

        {/* Tombol kanan */}
        <View className="flex-row items-center">
          {/* Tombol Location */}
          <TouchableOpacity
            className="bg-gray-100 p-2 rounded-xl mr-2"
            onPress={() => navigation.navigate("Location")}
          >
            <Ionicons name="map-outline" size={22} color="#888888" />
          </TouchableOpacity>

          {/* Tombol Profile */}
          <TouchableOpacity
            className="bg-gray-100 p-2 rounded-xl"
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person-outline" size={22} color="#888888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Kategori */}
      <View className="flex-row px-6 mb-4">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl mr-2 items-center ${category === "food" ? "bg-orange-500" : "bg-gray-100"}`}
          onPress={() => {
            setCategory("food");
            setSelectedFilters([]);
          }}
        >
          <Text
            className={`font-semibold ${category === "food" ? "text-white" : "text-gray-400"}`}
          >
            🍽️ Makanan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl ml-2 items-center ${category === "drink" ? "bg-orange-500" : "bg-gray-100"}`}
          onPress={() => {
            setCategory("drink");
            setSelectedFilters([]);
          }}
        >
          <Text
            className={`font-semibold ${category === "drink" ? "text-white" : "text-gray-400"}`}
          >
            🥤 Minuman
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <Ionicons name="search-outline" size={18} color="#BBBBBB" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Cari makanan..."
            placeholderTextColor="#BBBBBB"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#BBBBBB" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter List */}
      <ScrollView className="flex-1 px-6">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          Pilih selera kamu (bisa lebih dari satu):
        </Text>

        {filtersLoading ? (
          <ActivityIndicator size="large" color="#FF6B35" />
        ) : (
          filters.map((item) => {
            const isSelected = selectedFilters.find((f) => f.id === item.id);
            return (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center px-4 py-4 rounded-xl mb-3 border ${isSelected ? "bg-orange-50 border-orange-500" : "bg-gray-50 border-gray-100"}`}
                onPress={() => toggleFilter(item)}
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${isSelected ? "bg-orange-500 border-orange-500" : "border-gray-300"}`}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  )}
                </View>
                <Text className="text-2xl mr-3">{item.emoji}</Text>
                <Text
                  className={`font-semibold ${isSelected ? "text-orange-500" : "text-gray-700"}`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Tombol Rekomendasikan */}
      <View className="px-6 py-4">
        <TouchableOpacity
          className={`py-4 rounded-2xl items-center ${selectedFilters.length > 0 || search ? "bg-orange-500" : "bg-gray-200"}`}
          onPress={handleRecommend}
          disabled={selectedFilters.length === 0 && !search}
        >
          <Text
            className={`font-bold text-base ${selectedFilters.length > 0 || search ? "text-white" : "text-gray-400"}`}
          >
            Rekomendasikan ✨
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
