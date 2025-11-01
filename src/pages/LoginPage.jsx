import React, { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  EyeOff,
  Eye,
  Hand,
  Sparkles,
  Shield,
  Users,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/features/userSlice";

import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const isAllFields = Object.values(data).every((el) => el !== "");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleForChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const togglePassword = () => {
    setIsPasswordShow(!isPasswordShow);
  };

  //google login logic

  const googleResponse = async (authResponse) => {
    try {
      // The `code` returned by Google's OAuth flow
      const code = authResponse.code;

      // Send the code to your backend for token exchange
      const res = await axios.get(`/proxy/api/user/login/google?code=${code}`, {
        withCredentials: true, // so cookies are handled correctly
      });

      if (res.data.success) {
        toast.success(res.data.msg);

        // Dispatch to redux
        dispatch(login(res.data));

        // Navigate based on role
        setTimeout(() => {
          if (res.data.role === "user") {
            navigate("/");
          } else if (res.data.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/login");
          }
        }, 100);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error(error?.response?.data?.message || "Google login failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: googleResponse,
    flow: "auth-code",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your existing login logic would go here
    try {
      e.preventDefault();
      const res = await axios.post("/proxy/api/user/login", data);
      if (res && res.data.success) {
        toast.success(res.data.msg);
        dispatch(login(res.data));

        setTimeout(() => {
          if (res.data.role === "user") {
            navigate("/");
          } else if (res.data.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/login");
          }
        }, 100);

        console.log(res.data);

        setData({ email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full opacity-10 animate-slow-spin"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>

            {/* Header */}
            <div className="relative text-center mb-10">
              {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-6 shadow-lg relative">
                <Hand className="text-white text-2xl" />  
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl blur opacity-30 animate-pulse"></div>
              </div> */}
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 pb-2">
                Sign In
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back! Please sign in to continue
              </p>
            </div>

            {/* Form */}
            <div className="relative space-y-6">
              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-gray-400 group-focus-within:text-orange-500 transition-all duration-300 w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 text-gray-700 placeholder-gray-500"
                    tabIndex={0}
                    name="email"
                    value={data.email}
                    onChange={handleForChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-gray-400 group-focus-within:text-orange-500 transition-all duration-300 w-5 h-5" />
                  </div>
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 text-gray-700 placeholder-gray-500"
                    name="password"
                    value={data.password}
                    onChange={handleForChange}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-300"
                  >
                    {isPasswordShow ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={!isAllFields}
                onClick={handleSubmit}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden ${
                  isAllFields
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="relative z-10">Sign In</span>
                <ArrowRight className="w-5 h-5 relative z-10" />
                {isAllFields && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button>

              {/* google sign in button */}
              <button
                onClick={googleLogin}
                className="w-full py-3 px-6  flex items-center justify-center gap-3 border border-gray-300 rounded-2xl text-gray-700 font-medium text-base bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98] cursor-pointer"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span>Sign in with Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="relative mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-bold text-orange-500 hover:text-orange-600 transition-colors duration-300"
                >
                  Create Account
                </a>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex justify-center space-x-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm">Secure Login</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Trusted by 1000+</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Premium Service</span>
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

export default LoginPage;
