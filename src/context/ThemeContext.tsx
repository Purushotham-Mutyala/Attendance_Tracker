import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  college: string;
  setCollege: (college: string) => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      college: 'Amrita Vishwa Vidyapeetham',
      setCollege: (college) => set({ college }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

const ThemeContext = createContext<ThemeState | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode, toggleTheme, college, setCollege } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, college, setCollege }}>
      {children}
    </ThemeContext.Provider>
  );
};