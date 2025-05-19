import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import lightModeImg from "../assets/light-mode-button.png";
import darkModeImg from "../assets/dark-mode-button.png";
const ThemeToggle = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        cursor: "pointer",
        border: "none",
        background: "transparent",
        transition: "transform 0.2s ease-in-out",
      }}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    >
      <img
        src={mode === "dark" ? darkModeImg : lightModeImg}
        alt={mode === "dark" ? "Dark mode icon" : "Light mode icon"}
        width="45"
        height="45"
      />
    </button>
  );
};

export default ThemeToggle;
