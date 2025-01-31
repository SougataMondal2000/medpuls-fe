"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  User,
  LogOut,
  UserPlus,
  FileText,
  UserCircle,
  TestTube,
  Pill,
  PlusCircle,
  Clock,
  Calendar,
  MessageSquare,
  ContactRound,
  FolderCode,
} from "lucide-react";
import Cookies from "js-cookie";

export default function Sidebar({ children }) {
  const [page, setPage] = useState("create-prescription");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("profile");
    router.push("/login");
  };

  const isAuthPage =
    pathname === "/login" || pathname === "/signup" || pathname === "/";

  const menuItems = [
    {
      id: "misc-management",
      label: "Misc Management",
      icon: <FolderCode size={20} />,
      subItems: [
        {
          id: "add-test",
          label: "Add Test",
          path: "/add-test",
          icon: <TestTube size={16} />,
        },
        {
          id: "add-medicine",
          label: "Add Medicine",
          path: "/add-medicine",
          icon: <Pill size={16} />,
        },
        {
          id: "add-dosage",
          label: "Add Dosage",
          path: "/add-dosage",
          icon: <PlusCircle size={16} />,
        },
        {
          id: "add-frequency",
          label: "Add Frequency",
          path: "/add-frequency",
          icon: <Clock size={16} />,
        },
        {
          id: "add-days",
          label: "Add Days",
          path: "/add-days",
          icon: <Calendar size={16} />,
        },
        {
          id: "add-remarks",
          label: "Add Remarks",
          path: "/add-remarks",
          icon: <MessageSquare size={16} />,
        },
      ],
    },
    {
      id: "patient-management",
      label: "Patient Management",
      icon: <User size={20} />,
      subItems: [
        {
          id: "add-patient",
          label: "Add Patient",
          path: "/add-patient",
          icon: <UserPlus size={16} />,
        },
        {
          id: "all-patients",
          label: "All Patients",
          path: "/all-patients",
          icon: <ContactRound size={16} />,
        },
        {
          id: "create-prescription",
          label: "Create Prescription",
          path: "/create-prescription",
          icon: <FileText size={16} />,
        },
      ],
    },
    {
      id: "my-profile",
      label: "My Profile",
      icon: <User size={20} />,
      subItems: [
        {
          id: "my-profile",
          label: "My Profile",
          path: "/my-profile",
          icon: <UserCircle size={16} />,
        },
      ],
    },
  ];

  const handleNavigation = (path, id) => {
    setPage(id);
    router.push(path);
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`bg-white shadow-md transition-all duration-300 ease-in-out relative flex flex-col ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          {!isCollapsed && (
            <h2 className="text-2xl font-semibold text-green-500 truncate">
              Dashboard
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} className="text-gray-600" />
            ) : (
              <ChevronLeft size={20} className="text-gray-600" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((menu) => (
            <div key={menu.id} className="mb-2">
              <div
                className={`flex items-center px-4 py-2 text-sm text-gray-600 font-medium ${
                  !isCollapsed ? "mb-1" : ""
                }`}
              >
                <div className="flex items-center justify-center min-w-[24px]">
                  {menu.icon}
                </div>
                {!isCollapsed && <span className="ml-3">{menu.label}</span>}
              </div>

              <div className={`${isCollapsed ? "px-2" : "px-3"}`}>
                {menu.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => handleNavigation(subItem.path, subItem.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                      page === subItem.id
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title={isCollapsed ? subItem.label : ""}
                  >
                    <div className="flex items-center justify-center min-w-[20px]">
                      {subItem.icon}
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 truncate">{subItem.label}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
            title={isCollapsed ? "Log Out" : ""}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-2">Log Out</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-green-50 to-white">
        {children}
      </main>
    </div>
  );
}
