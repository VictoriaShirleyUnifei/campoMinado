import { useAppTheme } from '@/context/ThemeProvider';

export function useColorScheme() {
  const { theme } = useAppTheme();
  return theme;
}
