"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Building2,
  Eye,
  X,
  Printer,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { baseURL } from "../urls";

const Profile = () => {
  const router = useRouter();

  const [profile, setProfile] = useState({});
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("profile");

    if (!storedToken) {
      router.push("/login");
    } else {
      setProfile(JSON.parse(storedUser));
    }
  }, [router]);

  console.log(profile.id);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`${baseURL}/doctor/${profile?.id}`);
        setDoctor(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setLoading(false);
      }
    };
    if (profile.id) {
      fetchDoctorData();
    }
  }, [profile]);

  const handlePreviewPrescription = async (patientId) => {
    try {
      const patientResponse = await axios.get(
        `${baseURL}/patients/${patientId}`
      );
      if (patientResponse.data.previousPrescriptions?.length > 0) {
        setSelectedPrescription(patientResponse.data);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Error fetching prescription:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-6">
                  Doctor Profile
                </h1>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">
                      Dr. {doctor.doctorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">{doctor.phoneNo}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">
                      {doctor.specialty || "General Medicine"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-4">
                    Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {doctor.patients?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Patients
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {doctor.patients?.reduce(
                          (total, patient) =>
                            total +
                            (patient.previousPrescriptions?.length || 0),
                          0
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Prescriptions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              Patient List
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-800">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-800">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-800">
                      Sex
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-800">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-800">
                      Prescriptions
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctor.patients?.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient.age}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient.sex}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient.previousPrescriptions?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handlePreviewPrescription(patient._id)}
                          className="text-green-600 hover:text-green-800 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showPreview && selectedPrescription && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h2 className="text-2xl font-semibold text-green-600">
                    Prescription Details
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                    onClick={() => setShowPreview(false)}
                  >
                    ✖
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Patient Information
                    </h3>
                    <ul className="text-gray-600">
                      <li>
                        <strong>Name:</strong> Sougata Mondal
                      </li>
                      <li>
                        <strong>Age:</strong> 32
                      </li>
                      <li>
                        <strong>Sex:</strong> Male
                      </li>
                      <li>
                        <strong>Phone:</strong> 7654567656
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Medical History
                    </h3>
                    <ul className="text-gray-600 list-disc pl-5">
                      <li>Asthma</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Previous Prescriptions
                    </h3>
                    <div className="border rounded-lg p-4 bg-green-50">
                      <h5 className="text-sm font-semibold text-gray-700 mt-2">
                        Medicines:
                      </h5>
                      <ul className="text-gray-600 list-disc pl-5">
                        <li>
                          <strong>Name:</strong> Crocin
                          <br />
                          <strong>Dosage:</strong> 1 after breakfast
                        </li>
                        <li>
                          <strong>Name:</strong> Pand
                          <br />
                          <strong>Dosage:</strong> 1 before breakfast
                        </li>
                      </ul>
                      <h5 className="text-sm font-semibold text-gray-700 mt-2">
                        Description:
                      </h5>
                      <ul className="text-gray-600 list-disc pl-5">
                        <li>Cough</li>
                        <li>Cold</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none"
                    onClick={() => console.log("Close modal")}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
