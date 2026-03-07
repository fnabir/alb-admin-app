import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  colorScheme: Appearance.getColorScheme() ?? 'light',
});

const THEME_STORAGE_KEY = '@app_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    () => Appearance.getColorScheme() ?? 'light',
  );
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;

    const listener = Appearance.addChangeListener(
      ({ colorScheme: newScheme }) => {
        if (isUpdatingRef.current) return;
        setColorScheme(newScheme ?? 'light');
      },
    );

    return () => listener.remove();
  }, [theme]);

  useEffect(() => {
    isUpdatingRef.current = true;

    if (theme === 'system') {
      setColorScheme(Appearance.getColorScheme() ?? 'light');
    } else {
      setColorScheme(theme);
    }

    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  }, [theme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
