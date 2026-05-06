import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const item = window.localStorage.getItem("darkMode");
      return item === "true";
    } catch (error) {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("darkMode", String(isDark));
    } catch (error) {
      console.error("Error saving dark mode setting", error);
    }

    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return { isDark, toggleDarkMode };
}
