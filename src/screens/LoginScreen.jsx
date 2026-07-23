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
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { CommonActions } from "@react-navigation/native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }

    try {
      setLoading(true);

      let loginEmail = email;

      // Cek apakah input adalah username (tidak mengandung @)
      if (!email.includes("@")) {
        // Cari email berdasarkan username di Firestore
        const q = query(
          collection(db, "users"),
          where("username", "==", email),
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert("Error", "Username tidak ditemukan!");
          return;
        }

        // Ambil email dari Firestore
        loginEmail = querySnapshot.docs[0].data().email;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        password,
      );
      const user = userCredential.user;

      // Cek verifikasi email
      if (!user.emailVerified) {
        Alert.alert(
          "Email Belum Diverifikasi",
          "Cek email kamu untuk verifikasi. Mau kirim ulang email verifikasi?",
          [
            { text: "Tidak", style: "cancel" },
            {
              text: "Kirim Ulang",
              onPress: async () => {
                await sendEmailVerification(user);
                Alert.alert("Sukses", "Email verifikasi telah dikirim ulang!");
              },
            },
          ],
        );
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.data()?.role;

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Loading" }],
        }),
      );
      
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        Alert.alert("Error", "Email/username atau password salah!");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Format email tidak valid!");
      } else if (error.code === "auth/too-many-requests") {
        Alert.alert(
          "Error",
          "Terlalu banyak percobaan login. Coba lagi nanti!",
        );
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Masukkan email kamu dulu!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Sukses", "Link reset password telah dikirim ke email kamu!");
    } catch (error) {
      Alert.alert("Error", "Email tidak ditemukan!");
    }
  };

  return (
    <View className="flex-1 bg-slate-950 px-6 justify-center">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-white mb-1">Masuk</Text>
        <Text className="text-sm text-gray-400 mb-8">
          Selamat datang kembali di CheatSheetAI
        </Text>
      </View>

      <View className="bg-white rounded-3xl px-6 py-8 shadow-lg">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Email atau Username
        </Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-4 mb-4 text-gray-800 bg-slate-950/5"
          placeholder="Masukkan Email atau Username"
          placeholderTextColor="#aaaaaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Password
        </Text>
        <View className="flex-row items-center bg-slate-950/5 border border-gray-200 rounded-xl mb-4">
          <TextInput
            className="pl-4 flex-1 text-gray-800"
            placeholder="Masukkan password"
            placeholderTextColor="#aaaaaa"
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

        <TouchableOpacity
          className="items-end mt-2 mb-6"
          onPress={handleForgotPassword}
        >
          <Text className="text-sm text-orange-500 font-semibold">
            Lupa Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-2xl items-center mb-4"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-base">Masuk</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate("Register")}
        >
          <Text className="text-sm text-gray-400">
            Belum punya akun?{" "}
            <Text className="text-orange-500 font-semibold">Daftar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
