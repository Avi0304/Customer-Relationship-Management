import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import lightModeImg from "../assets/light-mode-button.png"; // Ensure the path is correct
import darkModeImg from "../assets/dark-mode-button.png"; // You need to provide this image

const ThemeToggle = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <div onClick={toggleTheme} style={{ cursor: "pointer", display: "inline-block" }}>
      <img 
        src={mode === "dark" ? darkModeImg : lightModeImg} 
        alt="Theme Toggle"
        width="50" 
      />
    </div>
  );
};

export default ThemeToggle;
