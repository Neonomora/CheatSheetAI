import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'

export default function useRedirect(navigation, delay = 0) {
  const { user, role, loading } = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Tunggu loading selesai dulu
    if (loading) return

    // Tambah delay kecil untuk pastikan auth state stabil
    const stabilizeTimer = setTimeout(() => {
      setIsReady(true)
    }, 300)

    return () => clearTimeout(stabilizeTimer)
  }, [loading])

  useEffect(() => {
    if (!isReady) return

    const redirect = async () => {
      if (!user) {
        navigation.replace('Onboarding')
      } else if (role === 'superadmin') {
        navigation.replace('SuperAdminDashboard')
      } else if (role === 'admin') {
        const q = query(
          collection(db, 'stores'),
          where('adminUid', '==', user.uid)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
          navigation.replace('StoreSetup')
        } else {
          navigation.replace('AdminDashboard')
        }
      } else {
        navigation.replace('Home')
      }
    }

    if (delay > 0) {
      const timer = setTimeout(redirect, delay)
      return () => clearTimeout(timer)
    } else {
      redirect()
    }
  }, [isReady])
}