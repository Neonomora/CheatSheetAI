import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function PasswordPromptModal({ visible, onConfirm, onCancel }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = () => {
    onConfirm(password);
    setPassword("");
  };

  const handleCancel = () => {
    onCancel();
    setPassword("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full">
          {/* Title */}
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Konfirmasi Password
          </Text>
          <Text className="text-sm text-gray-400 mb-4">
            Masukkan password kamu untuk menghapus akun
          </Text>

          {/* Input Password */}
          <View className="border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between mb-6">
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Masukkan password"
              placeholderTextColor="#BBBBBB"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#BBBBBB"
              />
            </TouchableOpacity>
          </View>

          {/* Tombol */}
          <View className="flex-row">
            <TouchableOpacity
              className="flex-1 border border-gray-200 py-3 rounded-xl items-center mr-2"
              onPress={handleCancel}
            >
              <Text className="text-gray-500 font-semibold">Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-red-500 py-3 rounded-xl items-center ml-2"
              onPress={handleConfirm}
              disabled={!password}
            >
              <Text className="text-white font-semibold">Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
