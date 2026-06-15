import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = onAuthStateChanged(auth, async firebaseUser => {
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            const p = await getUserProfile(firebaseUser.uid);
            setProfile(p);
          } catch {
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
    return unsub;
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const p = await getUserProfile(user.uid);
      setProfile(p);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
