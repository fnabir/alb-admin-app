import { StatusBar } from "expo-status-bar";
import { useTheme } from "../contexts/ThemeContext";

function ThemedStatusBar() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  return (
    <StatusBar
      style={isDark ? 'light' : 'dark'}
      translucent
      backgroundColor="transparent"
    />
  );
}

export default ThemedStatusBar;