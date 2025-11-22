// Updated React Login Page With Realtime Validation + Error Messages + Enter Key Submit

import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  EyeOff,
  Eye,
  Sparkles,
  Shield,
  Users,
  Loader2,
} from "lucide-react";
import api from "../utils/apiInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/features/userSlice";

import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // NEW: realtime validation errors
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email) ? "" : "Enter a valid email address";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return password.length >= 6 ? "" : "Password must be at least 6 characters";
  };

  // realtime validation on typing
  const handleForChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (name === "email")
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    if (name === "password")
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const togglePassword = () => setIsPasswordShow((prev) => !prev);

  // Enter key submission
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data, errors]);

  const googleResponse = async (authResponse) => {
    try {
      const code = authResponse.code;
      setLoading(true);

      const res = await api.get(`/api/user/login/google?code=${code}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(login(res.data));

        setTimeout(() => {
          navigate(res.data.role === "admin" ? "/admin/dashboard" : "/");
        }, 100);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: googleResponse,
    flow: "auth-code",
  });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const emailError = validateEmail(data.email);
    const passError = validatePassword(data.password);

    setErrors({ email: emailError, password: passError });

    if (emailError || passError) return;

    try {
      setLoading(true);
      const res = await api.post("/api/user/login", data);

      if (res && res.data.success) {
        dispatch(login(res.data));
        toast.success(res.data.msg || "Login successful!");

        setTimeout(() => {
          // Redirect based on role
          if (res.data.role === "superadmin") {
            navigate("/superadmin/dashboard");
          } else if (res.data.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/"); // Default route for other users
          }
        }, 100);

        setData({ email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const isAllFields = data.email !== "" && data.password !== "";

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
                Sign In
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back! Please sign in to continue
              </p>
            </div>

            <div className="relative space-y-6">
              {/* Email */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/50 text-gray-700
                      ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-200 focus:border-orange-500"
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
                    <Lock className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/50 text-gray-700
                      ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    name="password"
                    value={data.password}
                    onChange={handleForChange}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {isPasswordShow ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  !isAllFields || errors.email || errors.password || loading
                }
                onClick={handleSubmit}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all duration-300
                  ${
                    !isAllFields || errors.email || errors.password || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={googleLogin}
                disabled={loading}
                className="w-full py-3 px-6 flex items-center justify-center gap-3 border border-gray-300 rounded-2xl text-gray-700 font-medium bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span>Sign in with Google</span>
              </button>
            </div>

            <div className="relative mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-bold text-orange-500 hover:text-orange-600"
                >
                  Create Account
                </a>
              </p>
            </div>
          </div>

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
          @keyframes slow-spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
          .animate-slow-spin { animation: slow-spin 20s linear infinite; }
        `,
        }}
      />
    </div>
  );
};

export default LoginPage;
