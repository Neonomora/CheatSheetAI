import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

// Ganti dengan config Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyCkn8cnIX8mEt3B3V5jvdlflxjJhs0zAgU",
  authDomain: "cheatsheetai-77926.firebaseapp.com",
  projectId: "cheatsheetai-77926",
  storageBucket: "cheatsheetai-77926.firebasestorage.app",
  messagingSenderId: "537691200417",
  appId: "1:537691200417:android:6ccb1dcd76223b42a1c9e0"
}

const app = initializeApp(firebaseConfig)

// Auth dengan AsyncStorage agar state tersimpan
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

export const db = getFirestore(app)