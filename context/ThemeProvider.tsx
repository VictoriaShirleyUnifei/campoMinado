// src/context/ThemeProvider.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme() as Theme;
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);

  const theme = useMemo(() => customTheme ?? systemTheme, [customTheme, systemTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within a ThemeProvider');
  return context;
}
