import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../services/firebase";

export default function AdminFiltersScreen({ navigation }) {
  const [category, setCategory] = useState("food");
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);

  const moveUp = async (index) => {
    if (index === 0) return;
    try {
      const newFilters = [...filters];
      const temp = newFilters[index - 1];
      newFilters[index - 1] = newFilters[index];
      newFilters[index] = temp;

      // Update order di Firestore
      const batch = writeBatch(db);
      newFilters.forEach((item, i) => {
        const ref = doc(db, "filters", category, "items", item.id);
        batch.update(ref, { order: i + 1 });
      });
      await batch.commit();
      setFilters(newFilters);
    } catch (error) {
      Alert.alert("Error", "Gagal mengubah urutan!");
    }
  };

  const moveDown = async (index) => {
    if (index === filters.length - 1) return;
    try {
      const newFilters = [...filters];
      const temp = newFilters[index + 1];
      newFilters[index + 1] = newFilters[index];
      newFilters[index] = temp;

      const batch = writeBatch(db);
      newFilters.forEach((item, i) => {
        const ref = doc(db, "filters", category, "items", item.id);
        batch.update(ref, { order: i + 1 });
      });
      await batch.commit();
      setFilters(newFilters);
    } catch (error) {
      Alert.alert("Error", "Gagal mengubah urutan!");
    }
  };

  const fetchFilters = async () => {
    try {
      setLoading(true);
      const itemsRef = collection(db, "filters", category, "items");
      const q = query(itemsRef, orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      setFilters(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil data filter!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, [category]);

  const handleDelete = (item) => {
    Alert.alert("Hapus Filter", `Yakin mau hapus filter "${item.label}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "filters", category, "items", item.id));
            fetchFilters();
          } catch (error) {
            Alert.alert("Error", "Gagal hapus filter!");
          }
        },
      },
    ]);
  };

  const handleReorder = async ({ data }) => {
    try {
      setFilters(data);

      // Update order di Firestore sesuai urutan baru
      const batch = writeBatch(db);
      data.forEach((item, index) => {
        const ref = doc(db, "filters", category, "items", item.id);
        batch.update(ref, { order: index + 1 });
      });
      await batch.commit();
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan urutan!");
    }
  };

  const handleAddFilter = () => {
    navigation.navigate("AdminFilterForm", {
      category,
      nextOrder: filters.length + 1,
      onRefresh: fetchFilters,
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="mr-3"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Kelola Filter</Text>
        </View>

        {/* Tombol Tambah */}
        <TouchableOpacity
          className="bg-orange-500 px-4 py-2 rounded-xl flex-row items-center"
          onPress={handleAddFilter}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text className="text-white font-semibold ml-1">Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Kategori */}
      <View className="flex-row px-6 mb-4">
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

      {/* Loading */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      )}

      {/* Filter List */}
      {!loading && (
        <ScrollView className="flex-1 px-6">
          {filters.length === 0 ? (
            <View className="items-center justify-center mt-20">
              <Text className="text-gray-400">Belum ada filter</Text>
            </View>
          ) : (
            filters.map((item, index) => (
              <View
                key={item.id}
                className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 mb-3 border border-gray-100"
              >
                {/* Tombol Panah */}
                <View className="mr-3">
                  <TouchableOpacity
                    onPress={() => moveUp(index)}
                    disabled={index === 0}
                  >
                    <Ionicons
                      name="chevron-up"
                      size={18}
                      color={index === 0 ? "#DDDDDD" : "#888888"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => moveDown(index)}
                    disabled={index === filters.length - 1}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={
                        index === filters.length - 1 ? "#DDDDDD" : "#888888"
                      }
                    />
                  </TouchableOpacity>
                </View>

                {/* Emoji & Label */}
                <Text className="text-2xl mr-3">{item.emoji}</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-800">
                    {item.label}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    Urutan: {index + 1}
                  </Text>
                </View>

                {/* Tombol Edit & Hapus */}
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="bg-blue-50 p-2 rounded-lg mr-2"
                    onPress={() =>
                      navigation.navigate("AdminFilterForm", {
                        category,
                        item,
                        onRefresh: fetchFilters,
                      })
                    }
                  >
                    <Ionicons name="pencil-outline" size={16} color="#007AFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-red-50 p-2 rounded-lg"
                    onPress={() => handleDelete(item)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
