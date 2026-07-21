import { createContext, useContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext();

// Taruh di luar komponen agar bisa diakses logout
const isLoggedIn = { current: false };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          isLoggedIn.current = true;
          await firebaseUser.reload();
          const freshUser = auth.currentUser;

          if (freshUser?.emailVerified) {
            let userDoc = null;
            let retries = 0;

            while (retries < 3) {
              const snap = await getDoc(doc(db, "users", freshUser.uid));
              if (snap.exists()) {
                userDoc = snap;
                break;
              }
              await new Promise((resolve) => setTimeout(resolve, 1000));
              retries++;
            }

            if (userDoc) {
              setRole(userDoc.data()?.role || "user");
              setUser(freshUser);
            } else {
              setUser(null);
              setRole(null);
            }
          } else {
            setUser(null);
            setRole(null);
          }
        } else {
          // Ignore trigger null sementara setelah login
          if (!isLoggedIn.current) {
            setUser(null);
            setRole(null);
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    isLoggedIn.current = false;
    setLoading(true);
    await auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
