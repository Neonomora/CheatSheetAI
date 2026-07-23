import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../services/firebase";

export default function AdminMenuFormScreen({ route, navigation }) {
  const { store, item, onRefresh } = route.params;
  const isEdit = !!item;

  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price || "");
  const [location, setLocation] = useState(item?.location || "");
  const [category, setCategory] = useState(item?.category || "food");
  const [selectedFilters, setSelectedFilters] = useState(item?.filters || []);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);

  // fungsi format harga
  const formatPrice = (value) => {
    // Hapus semua karakter selain angka
    const numbers = value.replace(/[^0-9]/g, "");

    // Format dengan titik ribuan
    const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return formatted ? `Rp. ${formatted}` : "";
  };

  const handlePriceChange = (value) => {
    const formatted = formatPrice(value);
    setPrice(formatted);
  };

  const fetchFilters = async () => {
    try {
      setFiltersLoading(true);
      const q = query(
        collection(db, "filters", category, "items"),
        orderBy("order", "asc"),
      );
      const snapshot = await getDocs(q);
      setFilters(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setFiltersLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
    setSelectedFilters([]);
  }, [category]);

  const toggleFilter = (label) => {
    const exists = selectedFilters.includes(label);
    if (exists) {
      setSelectedFilters(selectedFilters.filter((f) => f !== label));
    } else {
      setSelectedFilters([...selectedFilters, label]);
    }
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert("Error", "Nama menu harus diisi!");
      return;
    }
    if (!price) {
      Alert.alert("Error", "Harga harus diisi!");
      return;
    }
    if (!location) {
      Alert.alert("Error", "Lokasi harus diisi!");
      return;
    }
    if (selectedFilters.length === 0) {
      Alert.alert("Error", "Pilih minimal 1 filter rasa!");
      return;
    }

    try {
      setLoading(true);

      const data = {
        name,
        price,
        location,
        category,
        filters: selectedFilters,
        createdAt: new Date().toISOString(),
      };

      if (isEdit) {
        await updateDoc(doc(db, "stores", store.id, "menus", item.id), data);
      } else {
        await addDoc(collection(db, "stores", store.id, "menus"), data);
      }

      onRefresh();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan menu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity className="mr-3" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">
          {isEdit ? "Edit Menu" : "Tambah Menu"}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Kategori */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Kategori
        </Text>
        <View className="flex-row mb-4">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl mr-2 items-center ${category === "food" ? "bg-orange-500" : "bg-gray-100"}`}
            onPress={() => setCategory("food")}
          >
            <Text
              className={`font-semibold ${category === "food" ? "text-white" : "text-gray-400"}`}
            >
              🍽️ Makanan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ml-2 items-center ${category === "drink" ? "bg-orange-500" : "bg-gray-100"}`}
            onPress={() => setCategory("drink")}
          >
            <Text
              className={`font-semibold ${category === "drink" ? "text-white" : "text-gray-400"}`}
            >
              🥤 Minuman
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nama */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Nama Menu
        </Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
          placeholder="contoh: Ayam Geprek"
          placeholderTextColor="#BBBBBB"
          value={name}
          onChangeText={setName}
        />

        {/* Harga */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">Harga</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
          placeholder="contoh: 15000"
          placeholderTextColor="#BBBBBB"
          keyboardType="number-pad"
          value={price}
          onChangeText={handlePriceChange}
        />

        {/* Lokasi */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">Lokasi</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
          placeholder="contoh: Jl. Sudirman No. 1"
          placeholderTextColor="#BBBBBB"
          value={location}
          onChangeText={setLocation}
        />

        {/* Filter */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Filter Rasa
        </Text>
        {filtersLoading ? (
          <ActivityIndicator size="small" color="#FF6B35" />
        ) : (
          <View className="flex-row flex-wrap mb-6">
            {filters.map((filter) => {
              const isSelected = selectedFilters.includes(filter.label);
              return (
                <TouchableOpacity
                  key={filter.id}
                  className={`px-3 py-2 rounded-xl mr-2 mb-2 border ${isSelected ? "bg-orange-500 border-orange-500" : "bg-gray-50 border-gray-200"}`}
                  onPress={() => toggleFilter(filter.label)}
                >
                  <Text
                    className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-600"}`}
                  >
                    {filter.emoji} {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Tombol Simpan */}
        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-2xl items-center mb-6"
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-base">
              {isEdit ? "Simpan Perubahan" : "Tambah Menu"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
