import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import PasswordPromptModal from "../components/PasswordPromptModal";

export default function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, logout } = useAuth();

  // Ambil inisial dari username
  const getInitial = () => {
    const name = user?.displayName || "U";
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Yakin mau keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Onboarding" }],
              }),
            );
          } catch (error) {
            Alert.alert("Error", "Gagal logout, coba lagi!");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hapus Akun",
      "Akun kamu akan dihapus permanen dan tidak bisa dikembalikan. Yakin?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => setModalVisible(true),
        },
      ],
    );
  };

  const handleConfirmDelete = async (password) => {
    try {
      setModalVisible(false);

      // Reauth dulu
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Hapus Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // Hapus Auth
      await deleteUser(auth.currentUser);

      // Reset navigasi
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Onboarding" }],
        }),
      );
    } catch (error) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        Alert.alert("Error", "Password salah!");
      } else {
        Alert.alert("Error", "Gagal hapus akun, coba lagi!");
        console.error(error);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-14 pb-4">
        <Text className="text-2xl font-bold text-gray-800">Profil</Text>
      </View>

      {/* Avatar & Info */}
      <View className="items-center py-8">
        {/* Inisial Avatar */}
        <View className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center mb-4">
          <Text className="text-3xl font-bold text-white">{getInitial()}</Text>
        </View>

        {/* Username */}
        <Text className="text-xl font-bold text-gray-800 mb-1">
          {user?.displayName || "Pengguna"}
        </Text>

        {/* Email */}
        <Text className="text-sm text-gray-400">{user?.email}</Text>

        {/* Badge verifikasi */}
        <View className="flex-row items-center mt-2">
          <Ionicons
            name={user?.emailVerified ? "checkmark-circle" : "close-circle"}
            size={14}
            color={user?.emailVerified ? "#34C759" : "#FF3B30"}
          />
          <Text
            className={`text-xs ml-1 ${user?.emailVerified ? "text-green-500" : "text-red-500"}`}
          >
            {user?.emailVerified
              ? "Email Terverifikasi"
              : "Email Belum Terverifikasi"}
          </Text>
        </View>
      </View>

      {/* Menu */}
      <View className="px-6">
        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center bg-gray-50 px-4 py-4 rounded-2xl mb-3"
          onPress={handleLogout}
        >
          <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
            <Ionicons name="log-out-outline" size={16} color="#FF6B35" />
          </View>
          <Text className="text-gray-700 font-semibold flex-1">Logout</Text>
          <Ionicons name="chevron-forward" size={16} color="#BBBBBB" />
        </TouchableOpacity>

        {/* Hapus Akun */}
        <TouchableOpacity
          className="flex-row items-center bg-red-50 px-4 py-4 rounded-2xl"
          onPress={handleDeleteAccount}
        >
          <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-3">
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
          </View>
          <Text className="text-red-500 font-semibold flex-1">Hapus Akun</Text>
          <Ionicons name="chevron-forward" size={16} color="#BBBBBB" />
        </TouchableOpacity>
      </View>
      <PasswordPromptModal
        visible={modalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}
