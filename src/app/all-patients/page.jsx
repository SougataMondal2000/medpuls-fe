"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit3 } from "lucide-react";
import { baseURL } from "../urls";
import Cookies from "js-cookie";

const PatientManagementTable = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${baseURL}/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  const handleEditPatient = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${baseURL}/patients/${selectedPatient._id}`,
        selectedPatient,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPatients(
        patients.map((p) => (p._id === response.data._id ? response.data : p))
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const handleDeletePatient = async () => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${baseURL}/patients/${selectedPatient._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPatients(patients.filter((p) => p._id !== selectedPatient._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen pt-10">
      <h1 className="text-3xl font-bold text-green-800 border-b-2 border-green-200 pb-4">
        Manage Patients
      </h1>
      <div className="bg-green-50 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-100 border-b border-green-200">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                Name
              </th>
              <th className="p-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                Age
              </th>
              <th className="p-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                Sex
              </th>
              <th className="p-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                Phone
              </th>
              <th className="p-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                Prescriptions
              </th>
              <th className="p-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {patients.map((patient) => (
              <tr
                key={patient._id}
                className="hover:bg-green-50 transition-colors duration-200"
              >
                <td className="p-3 text-sm text-green-900">{patient.name}</td>
                <td className="p-3 text-sm text-green-900">{patient.age}</td>
                <td className="p-3 text-sm text-green-900">{patient.sex}</td>
                <td className="p-3 text-sm text-green-900">{patient.phone}</td>
                <td className="p-3 text-sm text-green-900">
                  {patient.previousPrescriptions?.length || 0}
                </td>
                <td className="p-3">
                  <div className="flex space-x-2 justify-center">
                    <button
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-96 p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center">
              Edit Patient
            </h2>
            <form onSubmit={handleEditPatient} className="space-y-4">
              <input
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                placeholder="Name"
                value={selectedPatient.name}
                onChange={(e) =>
                  setSelectedPatient({
                    ...selectedPatient,
                    name: e.target.value,
                  })
                }
              />
              <input
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                placeholder="Age"
                type="number"
                value={selectedPatient.age}
                onChange={(e) =>
                  setSelectedPatient({
                    ...selectedPatient,
                    age: e.target.value,
                  })
                }
              />
              <input
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                placeholder="Sex"
                value={selectedPatient.sex}
                onChange={(e) =>
                  setSelectedPatient({
                    ...selectedPatient,
                    sex: e.target.value,
                  })
                }
              />
              <input
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                placeholder="Phone"
                value={selectedPatient.phone}
                onChange={(e) =>
                  setSelectedPatient({
                    ...selectedPatient,
                    phone: e.target.value,
                  })
                }
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="w-full p-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors duration-200"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-96 p-6 border border-red-100">
            <h2 className="text-2xl font-semibold text-red-800 mb-4 text-center">
              Delete Patient
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this patient?
            </p>
            <div className="flex space-x-3">
              <button
                className="w-full p-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors duration-200"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                onClick={handleDeletePatient}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagementTable;
