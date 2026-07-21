import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function NavigationGuard({ navigation }) {
  const { user, role, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    const timer = setTimeout(() => {
      if (!user) {
        navigation.replace('Onboarding')
      } else if (role === 'admin') {
        navigation.replace('AdminDashboard')
      } else {
        navigation.replace('Home')
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [user, role, loading])

  return null
}