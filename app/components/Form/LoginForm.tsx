"use client";

import { ReactNode, useState } from "react";
import { loginAction } from "../../actions/auth";

interface LoginFormProps {
  children?: ReactNode;
}

export default function LoginForm({ children }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {children}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>
      </form>
    </>
  );
}
