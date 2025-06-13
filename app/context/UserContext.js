'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Recuperar datos del usuario del localStorage al cargar la aplicación
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const updateUser = (data) => {
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
  };

  const updateUserAvatar = (avatarPath) => {
    const updatedUser = { ...userData, avatar: avatarPath };
    setUserData(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const clearUser = () => {
    setUserData(null);
    localStorage.removeItem('userData');
  };

  return (
    <UserContext.Provider value={{ userData, updateUser, updateUserAvatar, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 