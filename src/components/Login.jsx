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
      const response = await axios.post("http://localhost:8080/api/user/login", {
        email: values.email,
        password: values.password,
      });

      if (response.data.message === "OTP sent to your email. Please verify.") {
        setIsEnable2FA(true);
        setUserId(response.data.userId);
        setEmail(values.email);
        return;
      }

      const token = response.data.token;
      localStorage.setItem("token", token);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
        localStorage.setItem("rememberedPassword", values.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      const userResponse = await axios.get("http://localhost:8080/api/Profile/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userResponse.data);

      Swal.fire({
        title: "Login Successful!",
        text: "Redirecting...",
        icon: "success",
        iconColor: "green",
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Login Errors: ", error);

      if (error.response && error.response.data.message) {
        setErrors({ email: error.response.data.message });

        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
          iconColor: "red",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Something went wrong! Please try again.",
          icon: "error",
          iconColor: "red",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/user/verify-otp", {
        email: email,
        otp: otp,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      // Fetch user profile after successful OTP verification
      const userResponse = await axios.get("http://localhost:8080/api/Profile/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userResponse.data);

      Swal.fire({
        title: "Login Successful!",
        text: "Redirecting...",
        icon: "success",
        iconColor: "green",
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      Swal.fire({
        title: "OTP Verification Failed!",
        text: "Please enter the correct OTP.",
        icon: "error",
        iconColor: "red",
        confirmButtonText: "OK",
      });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {!isEnable2FA ? (<h2 className="text-3xl font-bold text-gray-800 text-center">
          Welcome Back
        </h2>) : (<>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <LuShield className="h-6 w-6 text-gray-700" />
          </div>

          <h2 className="tracking-tight text-2xl font-bold text-center mb-2">
            Verify Your Identity
          </h2>
        </>

        )}

        {!isEnable2FA ? (<p className="text-md text-gray-500 text-center mb-6">
          Login to access your account
        </p>) : (
          <p className="text-md text-muted-foreground mb-6 text-center">
            We've sent a 6-digit verification code to your email. Enter the code below to continue.
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
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full px-4 py-3 outline-none bg-transparent"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="p-3 text-gray-900 hover:text-gray-700 transition"
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
                  <label className="flex items-center text-sm text-gray-700">
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
                    className="text-sm font-medium text-black hover:underline hover:text-black"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
                {/* Sign-up Link */}
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-black font-semibold hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700">Enter verification code
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
              className="w-full mt-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
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
