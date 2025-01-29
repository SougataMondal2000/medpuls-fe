"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../urls";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Search,
  UserPlus,
  Pill,
  FileText,
  User,
  Calendar,
  Phone,
  Mail,
  Ruler,
  Weight,
  Heart,
  Activity,
  Plus,
  ClipboardList,
  Send,
  TestTube,
} from "lucide-react";
import {
  calculateBMI,
  calculateBMIPosition,
  getBMIMessage,
} from "../bmiCalculator";

const PrescriptionForm = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({});

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

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicinesData, setMedicinesData] = useState({
    drug: [],
    dose: [],
    frequency: [],
    day: [],
    remarks: [],
  });
  const [testsData, setTestsData] = useState([]);
  const [prescription, setPrescription] = useState({
    patientDetails: "",
    doctorDetails: "",
    medicines: [{ drug: "", dose: "", frequency: "", day: "", remarks: "" }],
    tests: [],
    description: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchPatientsData = async () => {
      try {
        const response = await axios.get(`${baseURL}/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients data:", error);
      }
    };

    fetchPatientsData();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const fetchMedicinesData = async () => {
      try {
        const response = await axios.get(`${baseURL}/misc-combined-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { test, ...medicines } = response.data.miscData;
        setTestsData(test);
        setMedicinesData(medicines);
      } catch (error) {
        console.error("Error fetching medicines data:", error);
      }
    };

    fetchMedicinesData();
  }, [token]);

  const handlePatientSelect = (id) => {
    const patient = patients.find((p) => p._id === id);
    setSelectedPatient(patient);
    setPrescription((prev) => ({ ...prev, patientDetails: id }));
  };

  const addMedicine = () => {
    setPrescription((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { drug: "", dose: "", frequency: "", day: "", remarks: "" },
      ],
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...prescription.medicines];
    newMedicines[index][field] = value;
    setPrescription((prev) => ({ ...prev, medicines: newMedicines }));
  };

  const handleTestChange = (value) => {
    setPrescription((prev) => ({
      ...prev,
      tests: [...prev.tests, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      prescription.doctorDetails = profile.id;
      const response = await axios.post(
        `${baseURL}/prescriptions`,
        prescription,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const prescriptionId = response.data._id;
      await axios.put(
        `${baseURL}/add-prescription/${prescription.patientDetails}/${profile.id}`,
        { prescriptionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Prescription created successfully");
    } catch (error) {
      console.error("Error submitting prescription", error);
    }
  };

  console.log(prescription, "raju");

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="p-6 border-b border-green-100">
          <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Create Prescription
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patient by name..."
                className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value.toLowerCase());
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
            </div>

            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-green-100 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {patients
                  .filter((patient) =>
                    patient.name.toLowerCase().includes(searchTerm)
                  )
                  .map((patient) => (
                    <div
                      key={patient._id}
                      className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        handlePatientSelect(patient._id);
                        setSearchTerm(patient.name);
                        setShowDropdown(false);
                      }}
                    >
                      <User className="h-4 w-4 text-green-600" />
                      <span>
                        {patient.name} ({patient.age} years)
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {selectedPatient && (
            <div className="bg-green-50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2 mb-4">
                <UserPlus className="h-5 w-5" />
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <strong>Name:</strong> {selectedPatient.name}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <strong>Age:</strong> {selectedPatient.age}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <strong>Phone:</strong> {selectedPatient.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  <strong>Mail:</strong> {selectedPatient.mail}
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-green-600" />
                  <strong>Height:</strong> {selectedPatient.height} cm
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-green-600" />
                  <strong>Weight:</strong> {selectedPatient.weight} kg
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-green-600" />
                  <strong>Pulse:</strong> {selectedPatient.pulse}
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <strong>BP:</strong> {selectedPatient.bp}
                </div>
                <div className="col-span-2">
                  <strong>Medical History:</strong>{" "}
                  {selectedPatient.medicalHistory.join(", ")}
                </div>
              </div>
              <div className="bg-green-50/50 rounded-lg p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      BMI Calculator
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {calculateBMI(
                        selectedPatient.height,
                        selectedPatient.weight
                      )}
                    </span>
                  </div>
                  <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-full flex">
                      <div
                        className="h-full bg-green-300"
                        style={{ width: "20%" }}
                      ></div>
                      <div
                        className="h-full bg-green-400"
                        style={{ width: "20%" }}
                      ></div>
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: "20%" }}
                      ></div>
                      <div
                        className="h-full bg-orange-400"
                        style={{ width: "20%" }}
                      ></div>
                      <div
                        className="h-full bg-red-400"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                    <div
                      className="absolute top-0 left-0 h-full w-1 bg-gray-800 transform -translate-x-1/2"
                      style={{
                        left: `${calculateBMIPosition(
                          calculateBMI(
                            selectedPatient.height,
                            selectedPatient.weight
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="text-center">
                      Underweight
                      <br />
                      &lt;18.5
                    </span>
                    <span className="text-center">
                      Normal
                      <br />
                      18.5-24.9
                    </span>
                    <span className="text-center">
                      Overweight
                      <br />
                      25-29.9
                    </span>
                    <span className="text-center">
                      Obese
                      <br />
                      30-34.9
                    </span>
                    <span className="text-center">
                      Severely Obese
                      <br />
                      &gt;35
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-4 mt-2">
                    <p className="text-sm text-gray-700">
                      {getBMIMessage(
                        calculateBMI(
                          selectedPatient.height,
                          selectedPatient.weight
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medicines
            </h3>
            {prescription.medicines.map((medicine, index) => (
              <div key={index} className="bg-green-50/50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {["drug", "dose", "frequency", "day", "remarks"].map(
                    (field) => (
                      <select
                        key={field}
                        className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        onChange={(e) =>
                          handleMedicineChange(index, field, e.target.value)
                        }
                        value={medicine[field]}
                      >
                        <option value="">Select {field}</option>
                        {medicinesData[field].map((item, i) => (
                          <option key={i} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    )
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMedicine}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Medicine
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Tests
            </h3>
            <div className="bg-green-50/50 rounded-lg p-4">
              <div className="grid grid-cols-1 gap-4">
                <select
                  className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  onChange={(e) => handleTestChange(e.target.value)}
                >
                  <option value="">Select Test</option>
                  {testsData.map((test, i) => (
                    <option key={i} value={test}>
                      {test}
                    </option>
                  ))}
                </select>
                {prescription.tests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {prescription.tests.map((test, index) => (
                      <div
                        key={index}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {test}
                        <button
                          onClick={() => {
                            const newTests = prescription.tests.filter(
                              (_, i) => i !== index
                            );
                            setPrescription((prev) => ({
                              ...prev,
                              tests: newTests,
                            }));
                          }}
                          className="hover:text-green-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Description
            </label>
            <textarea
              className="w-full p-4 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all min-h-[400px]"
              placeholder="Enter prescription description..."
              onChange={(e) =>
                setPrescription((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            onClick={handleSubmit}
          >
            <Send className="h-5 w-5" />
            Submit Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;
