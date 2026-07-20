import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";

export default function NavigationGuard({ navigation }) {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      // Jika konteks belum set `user` tapi ada `auth.currentUser`, tunggu sedikit.
      const hasAuthUser = !!auth.currentUser;

      if (!user && !hasAuthUser) {
        navigation.replace("Onboarding");
      } else if (role === "admin") {
        navigation.replace("AdminDashboard");
      } else {
        navigation.replace("Home");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user, role, loading]);

  return null;
}
