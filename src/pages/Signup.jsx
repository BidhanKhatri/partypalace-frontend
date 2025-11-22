// Updated Signup component with enhanced password validation and input icons
import api from "../utils/apiInstance";
import React, { useState } from "react";
import {
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const [loading, setLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const navigate = useNavigate();

  const validateField = (name, value) => {
    let err = "";

    if (name === "username") {
      if (!value.trim()) err = "Full name is required";
      else if (!/^[A-Za-z ]{3,}$/.test(value))
        err = "Name must be at least 3 letters";
    }

    if (name === "email") {
      if (!value.trim()) err = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        err = "Invalid email format";
    }

    if (name === "password") {
      if (!value.trim()) err = "Password is required";
      else if (value.length < 8) err = "Password must be at least 8 characters";
      else if (!/(?=.*[a-z])/.test(value))
        err = "Password must contain at least one lowercase letter";
      else if (!/(?=.*[A-Z])/.test(value))
        err = "Password must contain at least one uppercase letter";
      else if (!/(?=.*\d)/.test(value))
        err = "Password must contain at least one number";
      else if (!/(?=.*[@$!%*?&])/.test(value))
        err = "Password must contain at least one special character (@$!%*?&)";

      // Update password requirements
      setPasswordRequirements({
        length: value.length >= 8,
        uppercase: /(?=.*[A-Z])/.test(value),
        lowercase: /(?=.*[a-z])/.test(value),
        number: /(?=.*\d)/.test(value),
        specialChar: /(?=.*[@$!%*?&])/.test(value),
      });
    }

    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleForChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    validateField(name, value);
  };

  const togglePassword = () => {
    setIsPasswordShow(!isPasswordShow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((e) => e !== "");
    const emptyFields = Object.values(data).some((e) => e === "");

    if (hasErrors || emptyFields) {
      toast.error("Please fix all errors first");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/user/signup", data);
      if (res && res.data.success) {
        toast.success(res.data.msg);

        setTimeout(() => {
          navigate("/login");
        }, 100);

        setData({ username: "", email: "", password: "" });
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const isAllFields = Object.values(data).every(
    (el) => el !== "" && !errors[el]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full opacity-10 animate-slow-spin"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            <div className="relative text-center mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 pb-2">
                Create Account
              </h1>
            </div>

            <div className="relative space-y-6" onKeyDown={handleKeyDown}>
              {/* Username */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 text-gray-700 placeholder-gray-500 ${
                      errors.username
                        ? "border-red-500"
                        : "border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                    }`}
                    name="username"
                    value={data.username}
                    onChange={handleForChange}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 text-gray-700 placeholder-gray-500 ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                    }`}
                    name="email"
                    value={data.email}
                    onChange={handleForChange}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 text-gray-700 placeholder-gray-500 ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                    }`}
                    name="password"
                    value={data.password}
                    onChange={handleForChange}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-300"
                  >
                    {isPasswordShow ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password Requirements */}
                {data.password && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Password must contain:
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        {passwordRequirements.length ? (
                          <FaCheck className="text-green-500 mr-2" />
                        ) : (
                          <FaTimes className="text-red-500 mr-2" />
                        )}
                        <span
                          className={
                            passwordRequirements.length
                              ? "text-green-600"
                              : "text-gray-600"
                          }
                        >
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        {passwordRequirements.uppercase ? (
                          <FaCheck className="text-green-500 mr-2" />
                        ) : (
                          <FaTimes className="text-red-500 mr-2" />
                        )}
                        <span
                          className={
                            passwordRequirements.uppercase
                              ? "text-green-600"
                              : "text-gray-600"
                          }
                        >
                          One uppercase letter (A-Z)
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        {passwordRequirements.lowercase ? (
                          <FaCheck className="text-green-500 mr-2" />
                        ) : (
                          <FaTimes className="text-red-500 mr-2" />
                        )}
                        <span
                          className={
                            passwordRequirements.lowercase
                              ? "text-green-600"
                              : "text-gray-600"
                          }
                        >
                          One lowercase letter (a-z)
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        {passwordRequirements.number ? (
                          <FaCheck className="text-green-500 mr-2" />
                        ) : (
                          <FaTimes className="text-red-500 mr-2" />
                        )}
                        <span
                          className={
                            passwordRequirements.number
                              ? "text-green-600"
                              : "text-gray-600"
                          }
                        >
                          One number (0-9)
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        {passwordRequirements.specialChar ? (
                          <FaCheck className="text-green-500 mr-2" />
                        ) : (
                          <FaTimes className="text-red-500 mr-2" />
                        )}
                        <span
                          className={
                            passwordRequirements.specialChar
                              ? "text-green-600"
                              : "text-gray-600"
                          }
                        >
                          One special character (@$!%*?&)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  !Object.values(errors).every((e) => e === "") ||
                  Object.values(data).some((v) => v === "") ||
                  !Object.values(passwordRequirements).every((req) => req)
                }
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden ${
                  Object.values(errors).every((e) => e === "") &&
                  Object.values(data).every((v) => v !== "") &&
                  Object.values(passwordRequirements).every((req) => req)
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="relative mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-bold text-orange-500 hover:text-orange-600"
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes slow-spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          .animate-slow-spin {
            animation: slow-spin 20s linear infinite;
          }
        `,
        }}
      />
    </div>
  );
};

export default Signup;
