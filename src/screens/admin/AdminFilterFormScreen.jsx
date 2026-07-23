import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function AdminFilterFormScreen({ route, navigation }) {
  const { category, item, nextOrder, onRefresh } = route.params;
  const isEdit = !!item;

  const [label, setLabel] = useState(item?.label || "");
  const [emoji, setEmoji] = useState(item?.emoji || "");
  const [order, setOrder] = useState(
    item?.order?.toString() || nextOrder?.toString() || "",
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!label || !emoji || !order) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        // Update
        await updateDoc(doc(db, "filters", category, "items", item.id), {
          label,
          emoji,
          order: parseInt(order),
        });
      } else {
        // Tambah baru
        await addDoc(collection(db, "filters", category, "items"), {
          label,
          emoji,
          order: parseInt(order),
        });
      }

      onRefresh();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan filter!");
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
          {isEdit ? "Edit Filter" : "Tambah Filter"}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Label */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">Label</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
          placeholder="contoh: Pedas"
          placeholderTextColor="#BBBBBB"
          value={label}
          onChangeText={setLabel}
        />

        {/* Emoji */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">Emoji</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
          placeholder="contoh: 🌶️"
          placeholderTextColor="#BBBBBB"
          value={emoji}
          onChangeText={setEmoji}
        />

        {/* Order */}
        {/* <Text className="text-sm font-semibold text-gray-700 mb-2">Urutan</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 mb-6 text-gray-800"
          placeholder="contoh: 1"
          placeholderTextColor="#BBBBBB"
          keyboardType="number-pad"
          value={order}
          onChangeText={setOrder}
        /> */}

        {/* Tombol Simpan */}
        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-2xl items-center"
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-base">
              {isEdit ? "Simpan Perubahan" : "Tambah Filter"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
