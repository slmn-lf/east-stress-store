"use client";

import React, { useState, useTransition } from "react";
import { submitOrder } from "@/app/actions/order";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import OrderSuccessModal from "@/app/components/OrderSuccessModal";

interface AdditionalField {
  id: string;
  label: string;
  type: string;
  options: string | null;
}

interface ProductOrderFormProps {
  product: {
    id: string;
    name: string;
    price: number;
    whatsapp: string;
    additionalFields: AdditionalField[];
    status?: string;
  };
}

export default function ProductOrderForm({ product }: ProductOrderFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    customerName: string;
    whatsappUrl: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    quantity: 1,
  });

  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Check if it's a custom field by checking if it exists in additionalFields
    const isCustomField = product.additionalFields?.some(
      (field) => field.label === name
    );

    if (isCustomField) {
      setCustomFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "quantity" ? parseInt(value) || 1 : value,
      }));
    }
  };

  const handleRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    label: string
  ) => {
    const { value } = e.target;
    setCustomFields((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.customerName.trim()) {
      setError("Nama pelanggan diperlukan");
      return;
    }

    if (!formData.customerPhone.trim()) {
      setError("Nomor telepon diperlukan");
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitOrder(product.id, {
          ...formData,
          customFields,
        });

        if (!result.success) {
          setError(result.error || "Terjadi kesalahan saat memproses pesanan");
          return;
        }

        // Show success modal and prepare for redirect
        setSuccessData({
          customerName: formData.customerName,
          whatsappUrl: generateWhatsAppUrl(
            product.whatsapp,
            result.whatsappMessage!
          ),
        });
        setShowSuccessModal(true);
      } catch (err) {
        setError("Terjadi kesalahan saat memproses pesanan");
        console.error(err);
      }
    });
  };

  const handleRedirectToWhatsApp = () => {
    if (successData?.whatsappUrl) {
      window.open(successData.whatsappUrl, "_blank");
      setShowSuccessModal(false);
      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        quantity: 1,
      });
      setCustomFields({});
    }
  };

  return (
    <div className="pt-8">
      {product.status !== "active" ? (
        <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-8 text-center">
          <div className="text-4xl font-bold text-gray-700 mb-2">Sold Out</div>
          <p className="text-gray-600">
            Produk ini tidak sedang tersedia untuk pemesanan.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-4 bg-neutral-800 p-4 rounded-md justify-center text-center">
              {" "}
              Form Pemesanan
            </h3>
          </div>
          {/* Customer Info Section */}
          <div className="bg-neutral-800 p-4 rounded-md space-y-3">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="customerName"
              >
                Nama Pelanggan
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                required
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="customerPhone"
              >
                Nomor WhatsApp
              </label>
              <input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                required
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="e.g. 0812345678 atau +62812345678"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="customerEmail"
              >
                Email
              </label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="customerAddress"
              >
                Alamat
              </label>
              <textarea
                id="customerAddress"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="Alamat pengiriman (opsional)"
                rows={2}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="quantity"
              >
                Jumlah Pemesanan *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
          {/* Additional Fields */}
          {product.additionalFields && product.additionalFields.length > 0 && (
            <div className="bg-neutral-800 p-4 rounded-md space-y-3">
              <h4 className="font-semibold text-sm mb-2"> Detail Pesanan</h4>

              {product.additionalFields.map((field) => {
                const fieldName = field.label;

                if (field.type === "textarea") {
                  return (
                    <div key={field.id}>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor={fieldName}
                      >
                        {field.label}
                      </label>
                      <textarea
                        id={fieldName}
                        name={fieldName}
                        value={customFields[fieldName] || ""}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2"
                        rows={3}
                      />
                    </div>
                  );
                }

                if (field.type === "number") {
                  return (
                    <div key={field.id}>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor={fieldName}
                      >
                        {field.label}
                      </label>
                      <input
                        id={fieldName}
                        name={fieldName}
                        type="number"
                        value={customFields[fieldName] || ""}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                  );
                }

                if (field.type === "radio") {
                  const options = field.options
                    ? field.options
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : [];

                  return (
                    <fieldset key={field.id}>
                      <legend className="block text-sm font-medium mb-2">
                        {field.label}
                      </legend>
                      <div className="flex flex-col gap-2">
                        {options.map((opt, idx) => (
                          <label
                            key={idx}
                            className="inline-flex items-center gap-2 text-sm"
                          >
                            <input
                              type="radio"
                              name={fieldName}
                              value={opt}
                              checked={customFields[fieldName] === opt}
                              onChange={(e) => handleRadioChange(e, fieldName)}
                              className="form-radio"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                }

                // Default to text input
                return (
                  <div key={field.id}>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor={fieldName}
                    >
                      {field.label}
                    </label>
                    <input
                      id={fieldName}
                      name={fieldName}
                      type="text"
                      value={customFields[fieldName] || ""}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                    />
                  </div>
                );
              })}
            </div>
          )}
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? <>Memproses...</> : <>Pesan Sekarang</>}
          </button>
        </form>
      )}

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        productName={product.name}
        customerName={successData?.customerName || ""}
        onRedirect={handleRedirectToWhatsApp}
      />
    </div>
  );
}
