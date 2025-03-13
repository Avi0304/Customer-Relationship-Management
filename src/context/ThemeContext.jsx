import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

export const ThemeContext = createContext();

const lightTheme = {
  primary: {
    main: '#2563EB', // Tailwind's blue-600
    light: '#3B82F6', // Tailwind's blue-500
    dark: '#1D4ED8', // Tailwind's blue-700
  },
  
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
    secondary: '#F1F5F9',
  },
  text: {
    primary: '#1E293B',
    secondary: '#475569',
  },
  divider: 'rgba(0, 0, 0, 0.08)',
  custom: {
    cardGradient: 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 100%)',
    shadowLight: '0 4px 15px rgba(0,0,0,0.05)',
    blurBackground: 'rgba(255, 255, 255, 0.8)',
  }
};

const darkTheme = {
  primary: {
    main: '#60A5FA', // Tailwind's blue-500 (Default Button Color)
    light: '#60A5FA', // Tailwind's blue-400 (Lighter Shade)
     dark: '#3B82F6', // Tailwind's blue-800 (Hover Color)
  },
  secondary: {
    main: '#D946EF', // Tailwind's pink-500
    light: '#F472B6', // Tailwind's pink-400
    dark: '#C026D3', // Tailwind's pink-700
    contrastText: '#1E293B',
  },
  background: {
    default: '#0F172A', // Darker Background
    paper: '#1E293B', // Slightly Lighter Background
    secondary: '#1E293B',
   
  },
  text: {
    primary: '#F8FAFC', // Light text
    secondary: '#CBD5E1', // Muted text
  },
  divider: 'rgba(255, 255, 255, 0.08)',
  custom: {
    cardGradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    shadowLight: '0 4px 15px rgba(0,0,0,0.3)',
    blurBackground: 'rgba(15, 23, 42, 0.8)',
  }
};


export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => {
    const selectedTheme = mode === 'light' ? lightTheme : darkTheme;
    return createTheme({
      palette: {
        mode,
        ...selectedTheme,
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: selectedTheme.background.paper,
              // transition: 'all 0.3s ease-in-out',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              background: selectedTheme.custom.cardGradient,
              backdropFilter: 'blur(10px)',
              // transition: 'all 0.3s ease-in-out',
            },
          },
        },
        
      },
      typography: {
        fontFamily: '"Inter", sans-serif',
      },
    });
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};