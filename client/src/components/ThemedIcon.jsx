import { Sprout, Zap, BookOpen, Cpu, Settings, Terminal } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function ThemedIcon({ type, className }) {
  const { theme } = useTheme();

  const iconMap = {
    logo: {
      garden: <Sprout className={className} />,
      cyberpunk: <Zap className={`${className} animate-pulse text-accent`} />,
    },
    blog: {
      garden: <BookOpen className={className} />,
      cyberpunk: <Cpu className={className} />,
    },
    settings: {
      garden: <Settings className={className} />,
      cyberpunk: <Terminal className={className} />,
    },
  };
  return iconMap[type][theme] || iconMap[type]["garden"];
}
