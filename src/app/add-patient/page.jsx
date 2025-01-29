"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  MinusCircle,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  User,
  Heart,
  Ruler,
  Weight,
  Activity,
  HeartPulse,
  ClipboardPlus,
} from "lucide-react";
import {
  calculateBMI,
  calculateBMIPosition,
  getBMIMessage,
} from "../bmiCalculator";
import { baseURL } from "../urls";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const PatientRegistrationForm = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUser = Cookies.get("profile");

    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      setProfile(JSON.parse(storedUser));
    }
  }, [router]);

  const [formData, setFormData] = useState({
    name: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      city: "",
      state: "",
    },
    age: "",
    sex: "",
    phone: "",
    mail: "",
    guardianName: "",
    height: "",
    weight: "",
    pulse: "",
    bp: "",
    medicalHistory: [""],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMedicalHistoryChange = (index, value) => {
    const updatedHistory = [...formData.medicalHistory];
    updatedHistory[index] = value;
    setFormData((prev) => ({
      ...prev,
      medicalHistory: updatedHistory,
    }));
  };

  const addMedicalHistoryField = () => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: [...prev.medicalHistory, ""],
    }));
  };

  const removeMedicalHistoryField = (index) => {
    const updatedHistory = formData.medicalHistory.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      medicalHistory: updatedHistory,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      formData.parentId = profile.id;
      const response = await axios.post(`${baseURL}/patients`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const patientId = response.data._id;
      await axios.put(
        `${baseURL}/add-patient/${profile.id}`,
        { patientId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({
        type: "success",
        content: "Patient registered successfully!",
      });
      setFormData({
        name: "",
        address: {
          addressLine1: "",
          addressLine2: "",
          pincode: "",
          city: "",
          state: "",
        },
        age: "",
        sex: "",
        phone: "",
        mail: "",
        guardianName: "",
        height: "",
        weight: "",
        pulse: "",
        bp: "",
        medicalHistory: [""],
      });
    } catch (error) {
      setMessage({
        type: "error",
        content:
          error.response?.data?.message ||
          "An error occurred while registering patient",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <UserPlus className="h-8 w-8 text-emerald-600" />
              New Patient Registration
            </h2>
            <p className="mt-2 text-gray-600">
              Enter the patient's details below
            </p>
          </div>

          {message.content && (
            <div
              className={`p-4 mb-6 rounded-lg ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.content}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-emerald-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={labelClasses}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="age" className={labelClasses}>
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="sex" className={labelClasses}>
                    Sex
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="guardianName" className={labelClasses}>
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    id="guardianName"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className={labelClasses}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mail" className={labelClasses}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="mail"
                    name="mail"
                    value={formData.mail}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Address Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="addressLine1" className={labelClasses}>
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="address.addressLine1"
                    value={formData.address.addressLine1}
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
                    name="address.addressLine2"
                    value={formData.address.addressLine2}
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
                      name="address.city"
                      value={formData.address.city}
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
                      name="address.state"
                      value={formData.address.state}
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
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-600" />
                Medical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="height" className={labelClasses}>
                    Height (cm)
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className={`${inputClasses} pl-10`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="weight" className={labelClasses}>
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className={`${inputClasses} pl-10`}
                      required
                    />
                  </div>
                </div>

                {formData.height && formData.weight && (
                  <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">
                          BMI Calculator
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                          {calculateBMI(formData.height, formData.weight)}
                        </span>
                      </div>

                      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-full flex">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: "20%" }}
                          ></div>
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: "20%" }}
                          ></div>
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: "20%" }}
                          ></div>
                          <div
                            className="h-full bg-orange-500"
                            style={{ width: "20%" }}
                          ></div>
                          <div
                            className="h-full bg-red-500"
                            style={{ width: "20%" }}
                          ></div>
                        </div>
                        <div
                          className="absolute top-0 left-0 h-full w-1 bg-gray-800 transform -translate-x-1/2"
                          style={{
                            left: `${calculateBMIPosition(
                              calculateBMI(formData.height, formData.weight)
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          Underweight
                          <br />
                          &lt;18.5
                        </span>
                        <span>
                          Normal
                          <br />
                          18.5-24.9
                        </span>
                        <span>
                          Overweight
                          <br />
                          25-29.9
                        </span>
                        <span>
                          Obese
                          <br />
                          30-34.9
                        </span>
                        <span>
                          Severely Obese
                          <br />
                          &gt;35
                        </span>
                      </div>

                      <div className="bg-gray-100 rounded-lg p-4 mt-2">
                        <p className="text-sm text-gray-700">
                          {getBMIMessage(
                            calculateBMI(formData.height, formData.weight)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="pulse" className={labelClasses}>
                    Pulse (bpm)
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="pulse"
                      name="pulse"
                      value={formData.pulse}
                      onChange={handleChange}
                      className={`${inputClasses} pl-10`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="bp" className={labelClasses}>
                    Blood Pressure
                  </label>
                  <div className="relative">
                    <HeartPulse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="bp"
                      name="bp"
                      value={formData.bp}
                      onChange={handleChange}
                      className={`${inputClasses} pl-10`}
                      placeholder="120/80"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardPlus className="h-5 w-5 text-emerald-600" />
                  Medical History
                </h3>
                <button
                  type="button"
                  onClick={addMedicalHistoryField}
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add More
                </button>
              </div>
              {formData.medicalHistory.map((history, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <span className="text-gray-600 font-medium min-w-[24px]">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={history}
                    onChange={(e) =>
                      handleMedicalHistoryChange(index, e.target.value)
                    }
                    className={inputClasses}
                    placeholder="Enter medical condition"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMedicalHistoryField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-nonefocus:ring-4 focus:ring-emerald-500/50 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Register Patient
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;
