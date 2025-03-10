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
          iconColor: "green",
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
        iconColor: 'red',
        timer: 1500,
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 text-left">
          Enter your email address and we'll send you a token to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-sm font-medium text-black hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
