"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  User,
  Phone,
  Calendar,
  UserCircle,
  ClipboardList,
  Pill,
  FileText,
  PlusCircle,
} from "lucide-react";
import { baseURL } from "../urls";

const PrescriptionForm = ({ user }) => {
  const initialState = {
    name: "",
    age: "",
    sex: "Male",
    phone: "",
    medicalHistory: "",
    medicines: [{ name: "", dosage: { timing: "", amount: "" } }],
    description: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "medicalHistory" || name === "description") {
      const lines = value.split("\n");
      const formattedLines = lines
        .map((line, index) => {
          if (line.match(/^\d+\./)) {
            line = line.replace(/^\d+\./, `${index + 1}.`);
          } else if (line.trim() && !line.match(/^\d+\./)) {
            line = `${index + 1}. ${line}`;
          }
          return line;
        })
        .join("\n");
      setFormData({ ...formData, [name]: formattedLines });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const medicines = [...formData.medicines];
    medicines[index][field] = value;
    setFormData({ ...formData, medicines });
  };

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: "", dosage: { timing: "", amount: "" } },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const patientResponse = await axios.post(`${baseURL}/patients`, {
        name: formData.name,
        age: formData.age,
        sex: formData.sex,
        phone: formData.phone,
        medicalHistory: formData.medicalHistory
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.replace(/^\d+\.\s*/, "")),
        parentId: user._id,
      });

      const patientId = patientResponse.data._id;

      const prescriptionResponse = await axios.post(
        `${baseURL}/prescriptions`,
        {
          patientDetails: patientId,
          doctorDetails: user._id,
          medicines: formData.medicines,
          description: formData.description
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => line.replace(/^\d+\.\s*/, "")),
        }
      );

      const prescriptionId = prescriptionResponse.data._id;

      await axios.put(`${baseURL}/add-patient/${user._id}`, {
        patientId: patientId,
      });

      await axios.put(`${baseURL}/add-prescription/${patientId}`, {
        prescriptionId: prescriptionId,
      });

      alert("Prescription saved successfully!");
      setFormData(initialState);
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Failed to save prescription. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-green-100">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-800">
          Create Prescription
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Patient Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter patient's full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-green-600" />
                  Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter contact number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-green-600" />
              Medical History
            </label>
            <textarea
              name="medicalHistory"
              placeholder="Start typing medical conditions (press Enter for new line)&#10;Example:&#10;1. Diabetes&#10;2. Hypertension&#10;3. Asthma"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Additional Instructions
            </label>
            <textarea
              name="description"
              placeholder="Start typing instructions (press Enter for new line)&#10;Example:&#10;1. Take medicine after meals&#10;2. Avoid alcohol&#10;3. Get adequate rest"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-600" />
              Medicines
            </label>
            <div className="space-y-3">
              {formData.medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <input
                    type="text"
                    placeholder="Medicine name (e.g., Amoxicillin)"
                    value={medicine.name}
                    onChange={(e) =>
                      handleMedicineChange(index, "name", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Timing (e.g., Twice daily)"
                    value={medicine.dosage.timing}
                    onChange={(e) =>
                      handleMedicineChange(index, "dosage", {
                        ...medicine.dosage,
                        timing: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Amount (e.g., 500mg)"
                    value={medicine.dosage.amount}
                    onChange={(e) =>
                      handleMedicineChange(index, "dosage", {
                        ...medicine.dosage,
                        amount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddMedicine}
              className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add Medicine
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
          >
            Generate Prescription
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
