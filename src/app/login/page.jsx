"use client";
import React, { useState } from "react";
import { Mail, Lock, Heart, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { baseURL } from "../urls";
import { BeatLoader } from "react-spinners";

const MediPulsLogo = () => (
  <div className="flex items-center gap-2 text-emerald-600">
    <Heart className="w-8 h-8 fill-emerald-500 stroke-2" />
    <span className="text-2xl font-bold">MediPuls</span>
  </div>
);

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseURL}/login`, formData);
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("profile", JSON.stringify(response.data.profile));
      setFormData({ email: "", password: "" });
      router.push("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]";
  const labelClasses =
    "block font-medium mb-1 text-gray-700 flex items-center gap-2";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="flex w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 bg-emerald-50 p-12 items-center justify-center relative">
          <div className="absolute top-8 left-8">
            <MediPulsLogo />
          </div>
          <div className="w-full max-w-md">
            <img src="/doc.png" alt="" className="object-cover " />
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="lg:hidden mb-8">
            <MediPulsLogo />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Welcome Back!
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in to your MediPuls account
            </p>

            {message && (
              <div
                className={`p-3 mb-6 text-center text-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${
                  message.includes("successful")
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={labelClasses}>
                  <Mail className="w-5 h-5 text-emerald-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="doctor@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClasses}>
                  <Lock className="w-5 h-5 text-emerald-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <a
                    href="#"
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-[0_4px_14px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.6)] transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <BeatLoader
                    color={"white"}
                    loading={isLoading}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Sign In"
                )}
              </button>

              <p className="text-center text-gray-600 mt-4">
                Don't have an account?{" "}
                <Link
                  href={"/signup"}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
