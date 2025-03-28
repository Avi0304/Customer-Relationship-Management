import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/forget-password",
        { email }
      );

      if (response.status === 200) {
        setIsSubmitted(true);
        Swal.fire({
          title: "Send Reset Token!",
          text: "Reset token send to your email.",
          timer: 1500,
          icon: "success",
          iconColor: currentTheme === "dark" ? "#4ade80" : "green",
          background: currentTheme === "dark" ? "#1e293b" : "#fff",
          color: currentTheme === "dark" ? "#f8fafc" : "#000",
          showConfirmButton: true,
          allowOutsideClick: false,
        });
        navigation("/reset-password");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to send reset link."
      );
      Swal.fire({
        title: "Oops!",
        text: "Something went Wrong...",
        icon: "error",
        iconColor: currentTheme === "dark" ? "#f87171" : "red", // Softer red in dark mode
        background: currentTheme === "dark" ? "#1e293b" : "#fff", // Dark slate for dark mode
        color: currentTheme === "dark" ? "#f8fafc" : "#000",
        timer: 1500,
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 dark:bg-slate-900 dark:shadow-[0px_15px_40px_-5px_rgba(255,255,255,0.3),0px_-5px_15px_-5px_rgba(255,255,255,0.15)]">

        <h1 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 text-left dark:text-slate-400">
          Enter your email address and we'll send you a token to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md 
              focus:ring-2 focus:outline-none 
              light:focus:ring-blue-500 
              dark:border-gray-800 dark:bg-slate-900 dark:text-white dark:focus:ring-gray-700"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 
            dark:bg-gradient-to-r dark:from-teal-500 dark:to-emerald-600 dark:hover:from-teal-600 dark:hover:to-emerald-700
"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-sm font-medium text-black hover:underline dark:text-slate-300"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
