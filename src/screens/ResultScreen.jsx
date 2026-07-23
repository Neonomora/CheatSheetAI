import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getRecommendation } from "../services/groqService";
import { searchMenus } from "../services/menuService";

export default function ResultScreen({ route, navigation }) {
  const { category, filters, search } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cari dari database dulu
      const dbResults = await searchMenus({ category, filters, search });

      if (dbResults.length > 0) {
        // Ada hasil dari database → tampilkan
        setResults(dbResults);
      } else {
        // Tidak ada → fallback ke Groq AI
        const aiResults = await getRecommendation({
          category,
          filters,
          search,
        });
        setResults(aiResults);
      }
    } catch (err) {
      setError("Gagal mendapatkan rekomendasi. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity className="mr-3" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-800">
            Rekomendasi {category === "food" ? "Makanan" : "Minuman"}
          </Text>
          {search ? (
            <Text className="text-sm text-gray-400">Pencarian: {search}</Text>
          ) : (
            <Text className="text-sm text-gray-400">
              {filters.map((f) => f.label).join(", ")}
            </Text>
          )}
        </View>
      </View>

      {/* Loading */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text className="text-sm text-gray-400 mt-4">
            AI sedang menyiapkan rekomendasi...
          </Text>
        </View>
      )}

      {/* Error */}
      {!loading && error && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-5xl mb-4">😕</Text>
          <Text className="text-base text-gray-500 text-center mb-6">
            {error}
          </Text>
          <TouchableOpacity
            className="bg-orange-500 px-6 py-3 rounded-xl"
            onPress={fetchRecommendation}
          >
            <Text className="text-white font-bold">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Result List */}
      {!loading && !error && (
        <ScrollView className="flex-1 px-6">
          {results.length === 0 ? (
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-5xl mb-4">🍽️</Text>
              <Text className="text-base text-gray-400 text-center">
                Tidak ada rekomendasi ditemukan
              </Text>
            </View>
          ) : (
            results.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100"
                onPress={() => navigation.navigate("Detail", { item })}
              >
                {/* Nama */}
                {/* Nama + Badge */}
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-base font-bold text-gray-800 flex-1 mr-2">
                    {item.name}
                  </Text>
                  <View
                    className={`px-2 py-1 rounded-lg ${item.source === "database" ? "bg-green-50" : "bg-blue-50"}`}
                  >
                    <Text
                      className={`text-xs font-semibold ${item.source === "database" ? "text-green-500" : "text-blue-500"}`}
                    >
                      {item.source === "database" ? "🏪 Toko" : "🤖 AI"}
                    </Text>
                  </View>
                </View>

                {/* Deskripsi */}
                <Text className="text-sm text-gray-400 mb-3" numberOfLines={2}>
                  {item.description}
                </Text>

                {/* Harga & Lokasi */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="pricetag-outline"
                        size={14}
                        color="#FF6B35"
                      />
                      <Text className="text-sm text-orange-500 font-semibold ml-1">
                        {item.price}
                      </Text>
                    </View>

                    <View className="flex-row items-center flex-1 justify-end ml-2">
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#888888"
                      />
                      <Text
                        className="text-sm text-gray-400 ml-1"
                        numberOfLines={1}
                        style={{ flex: 1 }}
                      >
                        {item.location}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Tombol Coba Lagi */}
          {results.length > 0 && (
            <TouchableOpacity
              className="border border-orange-500 py-3 rounded-2xl items-center mb-6"
              onPress={fetchRecommendation}
            >
              <Text className="text-orange-500 font-bold">
                🔄 Rekomendasi Ulang
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
}
