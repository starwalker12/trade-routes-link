import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cities, City } from '@/lib/mock-data';

export type UserRole = 'retailer' | 'supplier' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  shopName?: string;
  cityId?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
  cities: City[];
  logout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(cities[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const logout = () => {
    setUser(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        selectedCity,
        setSelectedCity,
        cities,
        logout,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
