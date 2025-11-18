"use client";

import React, { useEffect } from "react";

interface OrderSuccessModalProps {
  isOpen: boolean;
  productName: string;
  customerName: string;
  onRedirect?: () => void;
}

export default function OrderSuccessModal({
  isOpen,
  productName,
  customerName,
  onRedirect,
}: OrderSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto redirect after 3 seconds
      const timer = setTimeout(() => {
        onRedirect?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onRedirect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-pulse-in">
        <div className="p-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
            Pesanan Berhasil!
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Produk:</span> {productName}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Nama:</span> {customerName}
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-4 text-center">
            Pesanan Anda akan diproses dan Anda akan diarahkan ke WhatsApp untuk
            konfirmasi.
          </p>

          {/* Loading indicator */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Redirecting ke WhatsApp dalam 3 detik...
          </p>

          {/* Action Button */}
          <button
            onClick={onRedirect}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-colors"
          >
            Lanjut ke WhatsApp Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
