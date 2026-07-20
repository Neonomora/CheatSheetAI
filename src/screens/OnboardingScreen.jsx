import { View, Text, TouchableOpacity, Image } from "react-native";

// Onboarding — perkenalan singkat fitur app
// Tombol "Mulai" akan pindah ke Register

export default function OnboardingScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white px-6 justify-between py-16">
      {/* Konten Tengah */}
      <View className="flex-1 items-center justify-center">
        {/* Icon/Ilustrasi */}
        <Image
          source={require("../../assets/onboarding.png")}
          style={{ width: 250, height: 250 }}
          resizeMode="contain"
        />
        {/* Judul */}
        <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
          Temukan Makanan{"\n"}Terbaikmu
        </Text>

        {/* Deskripsi */}
        <Text className="text-base text-gray-400 text-center leading-6">
          Ceritakan mood makanmu, AI kami akan rekomendasikan makanan dan
          minuman terbaik untukmu!
        </Text>
      </View>

      {/* Tombol Bawah */}
      <View>
        {/* Tombol Mulai */}
        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-2xl items-center mb-4"
          onPress={() => navigation.replace("Register")}
        >
          <Text className="text-white font-bold text-base">Mulai Sekarang</Text>
        </TouchableOpacity>

        {/* Link Login */}
        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.replace("Login")}
        >
          <Text className="text-gray-400 text-sm">
            Sudah punya akun?{" "}
            <Text className="text-orange-500 font-bold">Masuk</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
