import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { SignupValidationSchema } from "./validation/AuthValidation";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, ButtonGroup, Box } from '@mui/material';


const SignUp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customer');
  const [adminKey, setAdminKey] = useState("");


  const handleSignup = async (values, { setSubmitting, setErrors }) => {
    try {

      const requestBody = {
        name: values.username,
        email: values.email,
        password: values.password,
      };

      if (activeTab === 'admin') {
        requestBody.adminKey = values.adminKey;
      }

      const response = await axios.post("http://localhost:8080/api/user/register", requestBody);

      // Check if registration was successful
      if (response.status === 201 || response.status === 200) {
        // Show success alert
        Swal.fire({
          title: "Registered Successfully!",
          text: "Redirecting to login...",
          icon: "success",
          iconColor: "green", // Removed `currentTheme` for safety
          background: "#fff",
          color: "#000",
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        // Navigate to login page after a delay
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        // If response is not success
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Signup Error:", error);

      // Handle API error response
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
          background: "#fff",
          color: "#000",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center light:bg-gray-100 px-4 py-5 dark:bg-slate-950 overflow-auto">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 dark:bg-slate-900 dark:shadow-[0px_15px_40px_-5px_rgba(255,255,255,0.3),0px_-5px_15px_-5px_rgba(255,255,255,0.15)]">

        <Box display="flex" justifyContent="center">
          <ButtonGroup
            variant="outlined"
            aria-label="account type tabs"
            sx={{
              borderRadius: '9999px',
              padding: '0px',
            }}
          >
            {['customer', 'admin'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'contained' : 'outlined'}
                onClick={() => setActiveTab(tab)}
                sx={{
                  textTransform: 'capitalize',
                  px: 2,   
                  py: 0.5, 
                  borderRadius: '9999px', 
                  fontWeight: 500, 
                  fontSize: '14px', 
                  letterSpacing: '0.4px',
                  backgroundColor: activeTab === tab ? 'linear-gradient(135deg, #6EE7B7, #3B82F6)' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#3B82F6',
                  borderColor: activeTab === tab ? 'transparent' : '#3B82F6',
                  '&:hover': {
                    backgroundColor: activeTab === tab ? '#3B82F6' : '#E0F7FF',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </ButtonGroup>
        </Box>


        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 text-center dark:text-white mt-1">
          {activeTab === 'admin' ? 'Create Admin Account' : 'Create an Account'}
        </h2>
        <p className="text-md text-gray-500 text-center mb-5 dark:text-slate-400">
          {activeTab === 'admin' ? 'Register as an administrator' : 'Sign up to get started'}
        </p>

        {/* Formik Form */}
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            adminKey: "",
          }}
          validationSchema={SignupValidationSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-slate-900 dark:text-white dark:focus:ring-gray-500 transition"
                  placeholder="Choose a username"
                />
                <ErrorMessage name="username" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-slate-900 dark:text-white dark:focus:ring-gray-500 transition"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-slate-900 dark:text-white dark:focus:ring-gray-500 transition"
                  placeholder="Create a password"
                />
                <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-slate-900 dark:text-white dark:focus:ring-gray-500 transition"
                  placeholder="Confirm your password"
                />
                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-xs mt-1" />
              </div>


              {activeTab === 'admin' && (
                <div>
                  <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Admin Registration Key
                  </label>
                  <Field
                    // id="adminKey"
                    type="password"
                    name="adminKey"
                    placeholder="Enter admin key"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-slate-900 dark:text-white dark:focus:ring-gray-500 transition"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                    Admin key required for administrator access
                  </p>
                </div>
              )}


              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 dark:from-teal-500 dark:to-emerald-600 dark:hover:from-teal-600 dark:hover:to-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="light:text-black font-semibold hover:underline dark:text-slate-300">
                  Login
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>

  );
};

export default SignUp;
