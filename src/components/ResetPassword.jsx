import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


function ResetPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setIsSuccess(false);

    try {
      const response = await axios.post("http://localhost:8080/api/user/reset-password", {
        email,
        token,
        newPassword,
      });

      if (response.status === 200) {
        setIsSuccess(true);

        Swal.fire({
          title: 'Password Reset Successfully...',
          text: 'Redirecting to the login page...',
          icon: 'success',
          iconColor: 'green',
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
        })
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
      Swal.fire({
        title: 'Oops!',
        text: 'Something went Wrong...',
        icon: 'error',
        iconColor: 'red',
        timer: 1500,
        confirmButtonText: "OK",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12">
      {/* Card Box */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Reset Your Password
        </h1>
        <p className="text-sm text-gray-600 text-left">
          Enter the token sent to your email along with your new password.
        </p>

   
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {errorMessage && (
              <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                placeholder="Enter the OTP"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
     

        <div className="text-center mt-4">
          <Link to="/forget-password" className="text-sm font-medium text-black hover:underline">
            Back to Send Token
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
