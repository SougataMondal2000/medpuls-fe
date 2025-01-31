"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, Building2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { baseURL } from "../urls";
import Cookies from "js-cookie";
import {
  calculateBMI,
  calculateBMIPosition,
  getBMIMessage,
} from "../bmiCalculator";
import PrescriptionPreview from "./PrescriptionPreview ";
import { BeatLoader } from "react-spinners";

const Profile = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({});
  const [doctor, setDoctor] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [patients, setPatients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUser = Cookies.get("profile");

    if (!storedToken) {
      router.push("/login");
    } else {
      setProfile(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, [router]);

  console.log(profile.id);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`${baseURL}/doctor/${profile?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const response = await axios.get(`${baseURL}/get-prescriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPrescription(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prescription data:", error);
        setLoading(false);
      }
    };
    if (token) {
      fetchPrescriptionData();
    }
  }, [token]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`${baseURL}/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prescription data:", error);
        setLoading(false);
      }
    };
    if (token) {
      fetchPatientData();
    }
  }, [token]);

  const handlePreviewPrescription = async (patientId) => {
    try {
      const patientResponse = await axios.get(
        `${baseURL}/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <BeatLoader
          color={"#56DDC3"}
          loading={loading}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  console.log(selectedPrescription, "raju");

  return (
    <>
      <div className="min-h-screen bg-transparent py-12 px-4">
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
                      Dr. {doctor?.doctorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">{doctor?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">{doctor?.phoneNo}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">
                      {doctor?.specialty || "General Medicine"}
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
                        {doctor?.patients?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Patients
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {doctor?.previousPrescriptions?.length || 0}
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

          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100 mb-8">
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
                  {patients?.map((patient) => (
                    <tr key={patient?._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient?.age}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient?.sex}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient?.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {patient?.previousPrescriptions?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() =>
                            handlePreviewPrescription(patient?._id)
                          }
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

          {/* <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              Prescription List
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
          </div> */}

          {showPreview && selectedPrescription && (
            <PrescriptionPreview
              selectedPrescription={selectedPrescription}
              setShowPreview={setShowPreview}
              calculateBMI={calculateBMI}
              calculateBMIPosition={calculateBMIPosition}
              getBMIMessage={getBMIMessage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
