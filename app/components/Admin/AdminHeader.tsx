"use client";

import { useState } from "react";
import LogoutButton from "../LogoutButton";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

export default function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { toggleSidebar, isCollapsed } = useSidebar();

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-40 transition-all duration-300 ${isCollapsed ? "md:left-20" : "md:left-64"}`}
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Header Title */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              A
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              Admin
            </span>
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <Link
                href="/admin/dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                onClick={() => setIsProfileOpen(false)}
              >
                My Store Profile
              </Link>
              <Link
                href="/admin/dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                onClick={() => setIsProfileOpen(false)}
              >
                Settings
              </Link>
              <div className="border-t border-gray-200 p-2">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
