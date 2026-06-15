import React, { createContext, useContext, useState } from 'react';

const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@itassist.ai',
  displayName: 'Демо Пользователь',
};

const DEMO_PROFILE = {
  uid: 'demo-user-001',
  email: 'demo@itassist.ai',
  displayName: 'Демо Пользователь',
  role: 'employee',
  department: 'IT',
  position: 'Сотрудник',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(DEMO_PROFILE);

  return (
    <AuthContext.Provider value={{
      user: DEMO_USER,
      profile,
      loading: false,
      refreshProfile: () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
