import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";

// Minta izin lokasi
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      return true;
    }

    // Kalau ditolak → arahkan ke settings
    Alert.alert(
      "Izin Lokasi Diperlukan",
      "Aplikasi membutuhkan akses lokasi untuk memberikan rekomendasi terbaik di sekitar kamu. Aktifkan di pengaturan HP.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Buka Pengaturan",
          onPress: () => Linking.openSettings(),
        },
      ],
    );
    return false;
  } catch (error) {
    console.error("Location error:", error);
    return false;
  }
};

// Cek status izin lokasi
export const checkLocationPermission = async () => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === "granted";
};

// Dapat koordinat user
export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return location.coords;
  } catch (error) {
    console.error("Get location error:", error);
    return null;
  }
};

// Cek apakah GPS aktif
export const checkGPSEnabled = async () => {
  const enabled = await Location.hasServicesEnabledAsync();
  return enabled;
};
