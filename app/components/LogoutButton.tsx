"use client";

import { logoutAction } from "../actions/auth";

interface LogoutButtonProps {
  fullWidth?: boolean;
}

export default function LogoutButton({ fullWidth = false }: LogoutButtonProps) {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 text-sm font-medium ${
        fullWidth ? "w-full" : ""
      }`}
    >
      Logout
    </button>
  );
}
