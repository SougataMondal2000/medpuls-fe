"use client";
import React, { useState, useEffect } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  Lock,
  Heart,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { baseURL } from "../urls";
import { BeatLoader } from "react-spinners";

export const MediPulsLogo = () => (
  <div className="flex items-center text-emerald-600">
    <Heart className="w-8 h-8 fill-emerald-500 stroke-2" />
    <span className="text-2xl font-bold">MediPuls</span>
  </div>
);

const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState({
    score: 0,
    message: "",
    color: "bg-gray-200",
  });

  useEffect(() => {
    const calculateStrength = (pass) => {
      let score = 0;
      if (pass.length >= 8) score++;
      if (pass.match(/[A-Z]/)) score++;
      if (pass.match(/[0-9]/)) score++;
      if (pass.match(/[^A-Za-z0-9]/)) score++;

      const strengthMap = {
        0: { message: "Very Weak", color: "bg-red-500" },
        1: { message: "Weak", color: "bg-orange-500" },
        2: { message: "Medium", color: "bg-yellow-500" },
        3: { message: "Strong", color: "bg-lime-500" },
        4: { message: "Very Strong", color: "bg-emerald-500" },
      };

      setStrength({
        score,
        ...strengthMap[score],
      });
    };

    calculateStrength(password);
  }, [password]);

  return (
    <div className="mt-2">
      <div className="flex gap-2 items-center mb-1">
        <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600">{strength.message}</span>
      </div>
      <div className="space-y-1 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          {password.length >= 8 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-gray-400" />
          )}
          Minimum 8 characters
        </div>
        <div className="flex items-center gap-1">
          {password.match(/[A-Z]/) ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-gray-400" />
          )}
          At least one uppercase letter
        </div>
        <div className="flex items-center gap-1">
          {password.match(/[0-9]/) ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-gray-400" />
          )}
          At least one number
        </div>
        <div className="flex items-center gap-1">
          {password.match(/[^A-Za-z0-9]/) ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-gray-400" />
          )}
          At least one special character
        </div>
      </div>
    </div>
  );
};

const SignupPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword" || name === "password") {
      const otherField = name === "password" ? "confirmPassword" : "password";
      setPasswordsMatch(value === formData[otherField]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const backendData = {
      doctorName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phoneNo: formData.phoneNo,
      password: formData.password,
    };

    try {
      const response = await axios.post(`${baseURL}/signup`, backendData);
      setMessage(response.data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        password: "",
        confirmPassword: "",
      });
      setIsLoading(false);
      router.push("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]";
  const labelClasses =
    "block font-medium mb-1 text-gray-700 flex items-center gap-2 max-md:text-xs";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="flex w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
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
            <h2 className="text-3xl font-bold mb-2 text-gray-800 flex items-center gap-2">
              Welcome to{" "}
              <span>
                <MediPulsLogo />
              </span>
            </h2>
            <p className="text-gray-600 mb-8">
              Join our network of healthcare professionals
            </p>

            {message && (
              <div
                className={`p-3 mb-6 text-center text-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${
                  message.includes("success") ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={labelClasses}>
                    <UserCircle className="w-5 h-5 text-emerald-600" />
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClasses}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label htmlFor="phoneNo" className={labelClasses}>
                    <Phone className="w-5 h-5 text-emerald-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNo"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <PasswordStrengthIndicator password={formData.password} />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className={labelClasses}>
                    <Lock className="w-5 h-5 text-emerald-600" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`${inputClasses} ${
                        !passwordsMatch && formData.confirmPassword
                          ? "border-red-300 focus:ring-red-500"
                          : ""
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {!passwordsMatch && formData.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-[0_4px_14px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.6)] transition-all duration-200"
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
                  "Sign Up"
                )}
              </button>

              <p className="text-center text-gray-600 mt-4">
                Already a member?{" "}
                <Link
                  href={"/login"}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
