import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoadingGuard({ navigation }) {
  const { user, role, loading } = useAuth()

  useEffect(() => {
    if (loading) return

if (!user) {
  navigation.replace('Onboarding')
} else if (role === 'superadmin') {
  navigation.replace('SuperAdminDashboard')
} else if (role === 'admin') {
  navigation.replace('AdminDashboard')
} else {
  navigation.replace('Home')
}
  }, [user, role, loading])

  return null
}