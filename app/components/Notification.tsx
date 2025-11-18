"use client";
import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  autoClose?: number;
}

export default function Notification({
  message,
  type,
  onClose,
  autoClose = 4000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, autoClose);

    return () => clearTimeout(timer);
  }, [autoClose, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "#dcfce7" : "#fee2e2";
  const borderColor = isSuccess ? "#86efac" : "#fca5a5";
  const textColor = isSuccess ? "#166534" : "#991b1b";
  const iconColor = isSuccess ? "#22c55e" : "#ef4444";

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: 8,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          minWidth: 300,
          fontWeight: 500,
          color: textColor,
        }}
      >
        {isSuccess ? (
          <CheckCircle size={24} color={iconColor} />
        ) : (
          <AlertCircle size={24} color={iconColor} />
        )}
        <span style={{ flex: 1 }}>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={20} color={textColor} />
        </button>
      </div>
    </div>
  );
}
