import Link from "next/link";

import { User, FilePlus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { MediPulsLogo } from "../signup/page";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");

    router.push("/login");
  };

  return (
    <nav className="bg-green-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <MediPulsLogo />

        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:text-green-200 transition-colors"
          >
            <FilePlus size={24} />
            <span>Create Prescription</span>
          </Link>

          <Link
            href="/my-profile"
            className="flex items-center space-x-2 hover:text-green-200 transition-colors"
          >
            <User size={20} />
            <span>My Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white text-green-500 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
