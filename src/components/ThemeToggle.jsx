import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import lightModeImg from "../assets/light-mode-button.png"; // Ensure correct path
import darkModeImg from "../assets/dark-mode-button.png"; // Ensure correct path

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
        // style={{ filter: mode === "dark" ? "invert(1)" : "none" }} // Ensures proper contrast
      />
    </button>
  );
};

export default ThemeToggle;
