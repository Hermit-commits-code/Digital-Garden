import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check local storage so the user's choice is remembered on refresh
  const [theme, setTheme] = useState(
    localStorage.getItem("garden-theme") || "garden"
  );
  useEffect(() => {
    // Apply the theme to the <html> tag so Tailwind can see it
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("garden-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
