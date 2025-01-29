"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get("token");

    if (!storedToken) {
      router.push("/login");
    } else {
      router.push("/create-prescription");
    }
  }, [router]);

  return <main>Page</main>;
}
