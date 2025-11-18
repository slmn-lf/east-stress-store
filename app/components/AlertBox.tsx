"use client";

import { X } from "lucide-react";

export interface AlertProps {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  showConfirm?: boolean;
}

export function AlertBox({
  isOpen,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  showConfirm = false,
}: AlertProps) {
  if (!isOpen) return null;

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  };

  const titleColors = {
    success: "text-green-900",
    error: "text-red-900",
    warning: "text-yellow-900",
    info: "text-blue-900",
  };

  const messageColors = {
    success: "text-green-700",
    error: "text-red-700",
    warning: "text-yellow-700",
    info: "text-blue-700",
  };

  const buttonColors = {
    success: "bg-green-600 hover:bg-green-700",
    error: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`w-full max-w-md rounded-lg border-2 p-6 ${bgColors[type]}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${iconColors[type]}`}
            >
              {icons[type]}
            </div>
            <div className="flex-1">
              <h2 className={`text-lg font-semibold ${titleColors[type]}`}>
                {title}
              </h2>
              <p className={`mt-2 ${messageColors[type]}`}>{message}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`text-gray-400 hover:text-gray-600 ${iconColors[type]}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          {showConfirm && onConfirm && (
            <button
              onClick={onConfirm}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white ${buttonColors[type]}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertBox;
