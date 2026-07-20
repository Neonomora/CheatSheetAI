import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    // Validasi input
    if (!username || !email || !password) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }
    if (username.length < 3) {
      Alert.alert("Error", "Username minimal 3 karakter!");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter!");
      return;
    }

    try {
      setLoading(true);

      // Buat akun di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Simpan username di Firebase Auth
      await updateProfile(user, { displayName: username });

      // Kirim email verifikasi
      await sendEmailVerification(user);

      // Simpan data user di Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        role: "user", // default role
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        "Verifikasi Email",
        "Akun berhasil dibuat! Cek email kamu untuk verifikasi sebelum login.",
        [{ text: "OK", onPress: () => navigation.replace("Login") }],
      );
    } catch (error) {
      // Pesan error yang lebih ramah
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Email sudah terdaftar!");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Format email tidak valid!");
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950 px-6 justify-center">
      <View className="items-center mb-8">
        {/* Header */}
        <Text className="text-3xl font-bold text-white mb-1">Daftar Akun</Text>
        <Text className="text-sm text-gray-400 mb-8">
          Buat akun untuk mulai gunakan CheatSheetAI
        </Text>
      </View>

      <View className="bg-white rounded-3xl px-6 py-8 shadow-lg">
        {/* Input Username */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Username
        </Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-4 mb-4 text-gray-800 bg-slate-950/5"
          placeholder="Masukkan username"
          placeholderTextColor="#aaaaaa"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        {/* Input Email */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-4 mb-4 text-gray-800 bg-slate-950/5"
          placeholder="Masukkan email"
          placeholderTextColor="#aaaaaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {/* Input Password */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Password
        </Text>
        <View className="flex-row items-center bg-slate-950/5 border border-gray-200 rounded-xl mb-4">
          <TextInput
            className="pl-4 flex-1 text-gray-800"
            placeholder="Minimal 6 karakter"
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            value={password}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            className="pr-4"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#aaaaaa"
            />
          </TouchableOpacity>
        </View>

        {/* Tombol Daftar */}
        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-2xl items-center mb-4"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-base">Daftar</Text>
          )}
        </TouchableOpacity>

        {/* Link Login */}
        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="text-sm text-gray-400">
            Sudah punya akun?{" "}
            <Text className="text-orange-500 font-semibold">Masuk</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
