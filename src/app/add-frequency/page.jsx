"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../urls";
import { Plus, Upload } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [names, setNames] = useState([""]);
  const [excelFile, setExcelFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = Cookies.get("token");

    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  };

  const addNameField = () => {
    setNames([...names, ""]);
  };

  const removeNameField = (index) => {
    const updatedNames = names.filter((_, i) => i !== index);
    setNames(updatedNames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (names.length === 1 && names[0]) {
        await axios.post(
          `${baseURL}/misc`,
          { name: names[0], type: "frequency" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage({
          type: "success",
          text: "Single record added successfully!",
        });
      } else {
        const bulkData = names
          .filter((name) => name)
          .map((name) => ({ name, type: "frequency" }));
        await axios.post(`${baseURL}/bulk-add-misc`, bulkData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage({
          type: "success",
          text: "Bulk data uploaded successfully!",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response.data.message });
    }
  };

  const handleExcelSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const response = await axios.post(
        `${baseURL}/bulk-add-misc-excel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ type: "error", text: error.response.data.message });
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setExcelFile(file);
    } else {
      setMessage({
        type: "error",
        text: "Please upload only Excel files (.xlsx or .xls)",
      });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-green-800 border-b-2 border-green-200 pb-4">
          Add Frequency
        </h1>

        {message && (
          <div
            className={`p-4 rounded-lg shadow-md ${
              message.type === "success"
                ? "bg-green-100 border-l-4 border-green-500 text-green-700"
                : "bg-red-100 border-l-4 border-red-500 text-red-700"
            }`}
          >
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Add Records
            </h2>
            <div className="space-y-4">
              {names.map((name, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="flex-1 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition-all duration-200"
                    placeholder="Enter name"
                  />
                  {names.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNameField(index)}
                      className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={addNameField}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add More
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors duration-200"
              >
                Submit Records
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <form onSubmit={handleExcelSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Bulk Add (Excel)
            </h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-green-600">
                Upload Excel File
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-green-500 bg-green-50"
                    : "border-green-200 hover:border-green-300"
                }`}
              >
                <Upload className="w-12 h-12 text-green-500 mb-4" />
                <div className="space-y-1 text-center">
                  <p className="text-sm text-green-600">
                    {excelFile
                      ? `Selected: ${excelFile.name}`
                      : "Drop your Excel file here, or click to browse"}
                  </p>
                  <input
                    ref={fileInputRef}
                    id="excelFile"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Only Excel files (.xlsx, .xls) are supported
                  </p>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={!excelFile}
              className={`w-full px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                excelFile
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
              }`}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Excel File
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
