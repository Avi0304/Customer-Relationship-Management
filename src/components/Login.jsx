import React, { useEffect, useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginValidationSchema } from "./validation/AuthValidation";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { LuShield } from "react-icons/lu";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEnable2FA, setIsEnable2FA] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const currentTheme = localStorage.getItem("theme") || "light";

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");

    if (storedEmail && storedPassword) {
      setSavedEmail(storedEmail);
      setSavedPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data.message === "OTP sent to your email. Please verify.") {
        setIsEnable2FA(true);
        setUserId(response.data.userId);
        setEmail(values.email);
        return;
      }

      const token = response.data.token;
      const expiresAt = response.data.expiresAt;
      const isAdmin = response.data.isAdmin;
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", isAdmin);
      localStorage.setItem("expiresAt", expiresAt);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
        localStorage.setItem("rememberedPassword", values.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      const userResponse = await axios.get(
        "http://localhost:8080/api/Profile/get-profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(userResponse.data);

      Swal.fire({
        title: "Login Successful!",
        text: "Redirecting...",
        icon: "success",
        iconColor: currentTheme === "dark" ? "#4ade80" : "green",
        background: currentTheme === "dark" ? "#1e293b" : "#fff",
        color: currentTheme === "dark" ? "#f8fafc" : "#000",
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      const timeLeft = expiresAt - Date.now();

      console.log("expiresAt from backend:", response.data.expiresAt);
      console.log("Current time:", Date.now());
      console.log("timeLeft:", timeLeft);

      const isUserAdmin = localStorage.getItem("isAdmin") === "true";
      setTimeout(() => {
        if (isUserAdmin) {
          navigate("/dashboard");
        } else {
          navigate("/customer-dashboard");
        }
      }, 1500);
    } catch (error) {
      console.error("Login Errors: ", error);

      if (error.response && error.response.data.message) {
        setErrors({ email: error.response.data.message });

        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
          iconColor: currentTheme === "dark" ? "#f87171" : "red",
          background: currentTheme === "dark" ? "#1e293b" : "#fff",
          color: currentTheme === "dark" ? "#f8fafc" : "#000",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Something went wrong! Please try again.",
          icon: "error",
          iconColor: currentTheme === "dark" ? "#f87171" : "red",
          background: currentTheme === "dark" ? "#1e293b" : "#fff",
          color: currentTheme === "dark" ? "#f8fafc" : "#000",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/verify-otp",
        {
          email: email,
          otp: otp,
        }
      );

      const token = response.data.token;
      const isAdmin = response.data.isAdmin;
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", isAdmin);

      // Fetch user profile after successful OTP verification
      const userResponse = await axios.get(
        "http://localhost:8080/api/Profile/get-profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(userResponse.data);

      Swal.fire({
        title: "Login Successful!",
        text: "Redirecting...",
        icon: "success",
        iconColor: currentTheme === "dark" ? "#4ade80" : "green",
        background: currentTheme === "dark" ? "#1e293b" : "#fff",
        color: currentTheme === "dark" ? "#f8fafc" : "#000",
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      setTimeout(() => {
        if (isAdmin) {
          navigate("/dashboard");
        } else {
          navigate("/customer-dashboard");
        }
      }, 1500);
    } catch (error) {
      Swal.fire({
        title: "OTP Verification Failed!",
        text: "Please enter the correct OTP.",
        icon: "error",
        iconColor: currentTheme === "dark" ? "#f87171" : "red",
        background: currentTheme === "dark" ? "#1e293b" : "#fff",
        color: currentTheme === "dark" ? "#f8fafc" : "#000",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 dark:bg-slate-900 dark:shadow-[0px_15px_40px_-5px_rgba(255,255,255,0.3),0px_-5px_15px_-5px_rgba(255,255,255,0.15)]">
        {!isEnable2FA ? (
          <h2 className="text-3xl font-bold light:text-gray-800 text-center dark:text-white">
            Welcome Back
          </h2>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <LuShield className="h-6 w-6 text-gray-700" />
            </div>

            <h2 className="tracking-tight text-2xl font-bold text-center mb-2 dark: text-white">
              Verify Your Identity
            </h2>
          </>
        )}

        {!isEnable2FA ? (
          <p className="text-md text-gray-500 text-center mb-6 dark:text-slate-400">
            Login to access your account
          </p>
        ) : (
          <p className="text-md text-muted-foreground mb-6 text-center dark:text-slate-400">
            We've sent a 6-digit verification code to your email. Enter the code
            below to continue.
          </p>
        )}

        {!isEnable2FA ? (
          <Formik
            enableReinitialize
            initialValues={{ email: savedEmail, password: savedPassword }}
            validationSchema={LoginValidationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark: dark:text-slate-300">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm light:focus:ring-indigo-500 light:focus:border-indigo-500 dark:border-gray-600 dark:bg-slate-900 dark:text-white dark:focus:ring-gray-500 transition"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg shadow-sm light:focus-within:ring-indigo-500 light:focus-within:border-indigo-500 dark:border-gray-600 dark:bg-slate-900 dark:text-white dark:focus:ring-gray-500 transition">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full px-4 py-3 outline-none bg-transparent"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="p-3 text-gray-900 hover:text-gray-700 transition dark:text-slate-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IoIosEye size={20} />
                      ) : (
                        <IoIosEyeOff size={20} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-700 dark:text-slate-400">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember Me
                  </label>
                  <Link
                    to="/forget-password"
                    className="text-sm font-medium text-black hover:underline hover:text-black dark:text-slate-300 dark:hover:text-white"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 dark:bg-gradient-to-r dark:from-teal-500 dark:to-emerald-600 dark:hover:from-teal-600 dark:hover:to-emerald-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>

                {/* Sign-up Link */}
                <p className="text-center text-sm text-gray-600 dark:text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-black font-semibold hover:underline dark:text-slate-300"
                  >
                    Sign up
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-400">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-slate-400">
              Enter verification code
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="button"
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 
              dark:bg-gradient-to-r dark:from-teal-500 dark:to-emerald-600 dark:hover:from-teal-600 dark:hover:to-emerald-700
"
              onClick={handleOtpSubmit}
            >
              Verify and Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
