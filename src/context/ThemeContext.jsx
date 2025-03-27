import React, { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";

export const ThemeContext = createContext();

const lightTheme = {
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
      light: "#3B82F6",
      dark: "#1D4ED8",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
      secondary: "#F1F5F9",
    },
    text: {
      primary: "#1E293B",
      secondary: "#475569",
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
};

const darkTheme = {
  palette: {
    mode: "dark",
    primary: {
      main: "#60A5FA",
      light: "#60A5FA",
      dark: "#3B82F6",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
      secondary: "#1E293B",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const theme = useMemo(
    () => createTheme(mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
