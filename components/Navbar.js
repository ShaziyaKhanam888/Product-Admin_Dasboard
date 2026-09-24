"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LogOut, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve logged-in user profile from cookies
    const userData = Cookies.get("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Failed to parse user cookie", err);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear auth credentials
    Cookies.remove("token");
    Cookies.remove("user");

    // Redirect to login page
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Dashboard Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-gray-800">
              Admin Dashboard
            </span>
          </div>

          {/* User Profile Info & Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
