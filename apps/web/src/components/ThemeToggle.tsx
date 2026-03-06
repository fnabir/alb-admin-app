import { Button } from '@repo/ui';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa6';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      icon={theme === 'light' ? FaMoon : FaSun}
      variant="outline"
      aria-label="Toggle Theme"
      onPress={toggleTheme}
    />
  );
}
