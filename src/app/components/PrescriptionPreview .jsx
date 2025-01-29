import React from "react";
import {
  X,
  User,
  Phone,
  Mail,
  UserPlus,
  Ruler,
  Weight,
  Heart,
  Activity,
  Home,
  FileText,
  Pill,
  TestTube,
  Calendar,
} from "lucide-react";

const PrescriptionPreview = ({
  selectedPrescription,
  setShowPreview,
  calculateBMI,
  calculateBMIPosition,
  getBMIMessage,
}) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-green-100 pb-4">
          <h2 className="text-3xl font-bold text-green-600 flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Prescription Details
          </h2>
          <button
            className="p-2 hover:bg-green-50 rounded-full transition-colors"
            onClick={() => setShowPreview(false)}
          >
            <X className="h-6 w-6 text-green-600" />
          </button>
        </div>

        <div className="space-y-8 h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
          <div className="bg-green-50/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2 mb-4">
              <User className="h-5 w-5" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="font-medium">Name:</span>{" "}
                {selectedPrescription.name}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium">Age:</span>{" "}
                {selectedPrescription.age}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="font-medium">Phone:</span>{" "}
                {selectedPrescription.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
                <span className="font-medium">Email:</span>{" "}
                {selectedPrescription.mail}
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-green-600" />
                <span className="font-medium">Guardian:</span>{" "}
                {selectedPrescription.guardianName}
              </div>
              <div className="col-span-2 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Address</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  {Object.entries(selectedPrescription.address).map(
                    ([key, value]) => (
                      <div key={key} className="text-gray-700">
                        <span className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>{" "}
                        {value}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5" />
              Health Metrics
            </h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-green-600" />
                <span className="font-medium">Pulse:</span>{" "}
                {selectedPrescription.pulse} bpm
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="font-medium">Blood Pressure:</span>{" "}
                {selectedPrescription.bp}
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-green-600" />
                <span className="font-medium">Height:</span>{" "}
                {selectedPrescription.height} cm
              </div>
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-green-600" />
                <span className="font-medium">Weight:</span>{" "}
                {selectedPrescription.weight} kg
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
                      selectedPrescription.height,
                      selectedPrescription.weight
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
                          selectedPrescription.height,
                          selectedPrescription.weight
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
                        selectedPrescription.height,
                        selectedPrescription.weight
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" />
              Medical History
            </h3>
            <ul className="text-gray-700 space-y-2">
              {selectedPrescription.medicalHistory.map((condition, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Previous Prescriptions
            </h3>
            {selectedPrescription.previousPrescriptions.map(
              (prescription, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-green-100"
                >
                  <h5 className="text-lg font-semibold text-green-700 mb-4">
                    Prescription #{index + 1}
                  </h5>

                  <div className="space-y-4">
                    <div>
                      <h6 className="text-sm font-medium text-green-600 flex items-center gap-2 mb-2">
                        <Pill className="h-4 w-4" />
                        Medicines
                      </h6>
                      <ul className="space-y-4">
                        {prescription.medicines.map((medicine, i) => (
                          <li key={i} className="bg-green-50/50 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="font-medium">Drug:</span>{" "}
                                {medicine.drug}
                              </div>
                              <div>
                                <span className="font-medium">Dosage:</span>{" "}
                                {medicine.dose}
                              </div>
                              <div>
                                <span className="font-medium">Frequency:</span>{" "}
                                {medicine.frequency}
                              </div>
                              <div>
                                <span className="font-medium">Day:</span>{" "}
                                {medicine.day}
                              </div>
                              <div className="col-span-2">
                                <span className="font-medium">Remarks:</span>{" "}
                                {medicine.remarks}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h6 className="text-sm font-medium text-green-600 flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" />
                        Description
                      </h6>
                      <ul className="space-y-2">
                        {prescription.description.map((desc, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h6 className="text-sm font-medium text-green-600 flex items-center gap-2 mb-2">
                        <TestTube className="h-4 w-4" />
                        Tests
                      </h6>
                      <ul className="space-y-2">
                        {prescription.tests.length > 0 ? (
                          prescription.tests.map((test, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                              {test}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500 italic">
                            No tests mentioned
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPreview;
