"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { baseURL } from "./urls";
import PrescriptionForm from "./components/PrescriptionForm";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("profile");

    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      setProfile(JSON.parse(storedUser));
    }
  }, [router]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const res = await axios.get(`${baseURL}/doctor/${profile?.id}`);
        setUser(res.data);
        toast.success("Data fetched successfully");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";
        toast.error(errorMessage);
      }
    };

    if (profile?.id) {
      fetchDoctorData();
    }
  }, [profile]);

  console.log(user, "raju");

  return (
    <main>
      <Navbar />
      <Toaster position="bottom-left" reverseOrder={false} />
      <PrescriptionForm user={user} />
    </main>
  );
}
