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
  MapPin,
  Pen,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { baseURL } from "../urls";
import { BeatLoader } from "react-spinners";

export const MediPulsLogo = () => (
  <div className="flex items-center text-emerald-600">
    <Heart className="w-8 h-8 fill-emerald-500 stroke-2" />
    <span className="text-2xl font-bold">MedPuls</span>
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
    clinicName: "",
    clinicAddress: {
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      city: "",
      state: "",
    },
    signature: null,
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name.includes("clinicAddress.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        clinicAddress: {
          ...prev.clinicAddress,
          [addressField]: value,
        },
      }));
    }
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "doctorName",
        `${formData.firstName} ${formData.lastName}`.trim()
      );
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNo", formData.phoneNo);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("clinicName", formData.clinicName);

      formDataToSend.append(
        "clinicAddress[addressLine1]",
        formData.clinicAddress.addressLine1
      );
      formDataToSend.append(
        "clinicAddress[addressLine2]",
        formData.clinicAddress.addressLine2
      );
      formDataToSend.append("clinicAddress[city]", formData.clinicAddress.city);
      formDataToSend.append(
        "clinicAddress[state]",
        formData.clinicAddress.state
      );
      formDataToSend.append(
        "clinicAddress[pincode]",
        formData.clinicAddress.pincode
      );

      if (image) {
        formDataToSend.append("signature", image);
      }

      const response = await axios.post(`${baseURL}/signup`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        password: "",
        confirmPassword: "",
        clinicName: "",
        clinicAddress: {
          addressLine1: "",
          addressLine2: "",
          pincode: "",
          city: "",
          state: "",
        },
      });

      setIsLoading(false);
      router.push("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]";
  const labelClasses =
    "block font-medium mb-1 text-gray-700 flex items-center gap-2 max-md:text-xs";

  console.log(formData, "raju");

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

        <div className="w-full lg:w-1/2 p-8 md:p-12 overflow-y-auto h-[70vh]">
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

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="email" className={labelClasses}>
                    <Mail className="w-5 h-5 text-emerald-600" />
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    id="clinicName"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="doctor@example.com"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Clinic Details
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="addressLine1" className={labelClasses}>
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="clinicAddress.addressLine1"
                      value={formData.clinicAddress.addressLine1}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="addressLine2" className={labelClasses}>
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="clinicAddress.addressLine2"
                      value={formData.clinicAddress.addressLine2}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="city" className={labelClasses}>
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="clinicAddress.city"
                        value={formData.clinicAddress.city}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className={labelClasses}>
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="clinicAddress.state"
                        value={formData.clinicAddress.state}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pincode" className={labelClasses}>
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="clinicAddress.pincode"
                        value={formData.clinicAddress.pincode}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label htmlFor="email" className={labelClasses}>
                  <Pen className="w-5 h-5 text-emerald-600" />
                  Add Signature
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Choose File
                </label>
                {image && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-full border border-gray-300"
                    />
                  </div>
                )}
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
