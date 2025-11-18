"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, AlertCircle, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { getProductById } from "@/app/actions/product-list";
import { AlertBox } from "@/app/components/AlertBox";
import { updateProduct } from "@/app/actions/update-product";

const DEFAULT_WHATSAPP = "6282110404070";

interface AdditionalField {
  id: number;
  label: string;
  type: "text" | "number" | "textarea" | "radio";
  options?: string;
}

interface AlertState {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [validUntil, setValidUntil] = useState("");
  const [whatsapp, setWhatsapp] = useState(DEFAULT_WHATSAPP);
  const [images, setImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>(
    []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);

        if (!data) {
          setAlert({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "Product not found",
          });
          setTimeout(() => router.push("/admin/dashboard/products"), 2000);
          return;
        }

        const formattedDate = new Date(data.validUntil || new Date())
          .toISOString()
          .split("T")[0];

        setName(data.name);
        setDescription(data.description || "");
        setPrice(data.price);
        setWhatsapp(data.whatsapp);
        setValidUntil(formattedDate);
        setImages(data.images || []);

        if (data.additionalFields && data.additionalFields.length > 0) {
          setAdditionalFields(
            data.additionalFields.map(
              (
                f: { label: string; type: string; options?: string | null },
                idx: number
              ) => ({
                id: idx,
                label: f.label,
                type: f.type as "text" | "number" | "textarea" | "radio",
                options: f.options || "",
              })
            )
          );
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        setAlert({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to load product",
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, router]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const totalImages = images.length + newFiles.length + selected.length;

    if (totalImages > 3) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Maximum 3 images allowed",
      });
      return;
    }

    setNewFiles((prev) => [...prev, ...selected]);
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const addField = () => {
    if (additionalFields.length >= 20) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Limit Reached",
        message: "Maximum 20 fields allowed",
      });
      return;
    }
    setAdditionalFields((prev) => [
      ...prev,
      { id: Date.now(), label: "Question", type: "text" },
    ]);
  };

  const updateField = (
    id: number,
    key: "label" | "type" | "options",
    value: string
  ) => {
    setAdditionalFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const removeField = (id: number) => {
    setAdditionalFields((prev) => prev.filter((f) => f.id !== id));
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > 1200) {
            height = (height * 1200) / width;
            width = 1200;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            "image/jpeg",
            0.7
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name || name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!description || description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!price || price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!whatsapp || whatsapp.trim().length === 0) {
      newErrors.whatsapp = "WhatsApp is required";
    }

    if (!validUntil) {
      newErrors.validUntil = "Valid until date is required";
    } else {
      const date = new Date(validUntil);
      if (date < new Date()) {
        newErrors.validUntil = "Valid until date must be in the future";
      }
    }

    if (images.length === 0 && newFiles.length === 0) {
      newErrors.images = "At least 1 image is required";
    }

    if (additionalFields.length === 0) {
      newErrors.fields = "At least 1 additional field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Please fix the errors above",
      });
      return;
    }

    setSubmitting(true);
    try {
      let finalImages = [...images];

      if (newFiles.length > 0) {
        const compressedFiles = await Promise.all(
          newFiles.map((file) => compressImage(file))
        );

        const uploadedUrls = await Promise.all(
          compressedFiles.map(async (blob) => {
            const formData = new FormData();
            formData.append("file", blob, "image.jpg");

            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Upload failed");
            }

            const data = await response.json();
            return data.url;
          })
        );

        finalImages = [...images, ...uploadedUrls];
      }

      const fieldsForDb = additionalFields.map((f) => ({
        label: f.label,
        type: f.type,
        options: f.options || null,
      }));

      const result = await updateProduct(productId, {
        name: name.trim(),
        description: description.trim(),
        price,
        whatsapp: whatsapp.trim(),
        validUntil,
        images: finalImages,
        additionalFields: fieldsForDb,
      });

      if (result.success) {
        setAlert({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Product updated successfully",
        });
        setTimeout(() => router.push("/admin/dashboard/products"), 1500);
      } else {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Error",
          message: result.error || "Failed to update product",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to update product",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/dashboard/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ChevronLeft size={20} />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">
          Update product information and images
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
                  errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-gray-900 ${
                  errors.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter product description (min 10 characters)"
                rows={5}
              />
              {errors.description && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.description}
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Price (IDR) *
              </label>
              <input
                type="number"
                id="price"
                value={price || ""}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
                  errors.price ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter price"
                min="1"
              />
              {errors.price && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.price}
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                WhatsApp Number *
              </label>
              <input
                type="text"
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
                  errors.whatsapp
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter WhatsApp number"
              />
              {errors.whatsapp && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.whatsapp}
                </div>
              )}
            </div>

            {/* Valid Until */}
            <div>
              <label
                htmlFor="validUntil"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Valid Until *
              </label>
              <input
                type="date"
                id="validUntil"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
                  errors.validUntil
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.validUntil && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.validUntil}
                </div>
              )}
            </div>
          </div>

          {/* Images Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Images
            </h3>

            {/* Existing Images */}
            {images.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Current Images
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-40 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload New Images (Max {3 - images.length - newFiles.length}{" "}
                more)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 flex flex-col items-center justify-center gap-2"
              >
                <Upload size={24} className="text-gray-400" />
                <span className="text-gray-600">Click to upload images</span>
              </button>

              {newFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {newFiles.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${idx + 1}`}
                        className="w-full h-40 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.images && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {errors.images}
              </div>
            )}
          </div>

          {/* Additional Fields */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Form Fields
              </h3>
              <button
                type="button"
                onClick={addField}
                disabled={additionalFields.length >= 20}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Plus size={16} />
                Add Field
              </button>
            </div>

            {additionalFields.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No fields yet. Add one to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {additionalFields.map((field) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-md bg-white space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Field label"
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, "label", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                      />
                      <select
                        value={field.type}
                        onChange={(e) =>
                          updateField(
                            field.id,
                            "type",
                            e.target.value as
                              | "text"
                              | "number"
                              | "textarea"
                              | "radio"
                          )
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                      >
                        <option value="text">Text Input</option>
                        <option value="number">Number</option>
                        <option value="textarea">Textarea</option>
                        <option value="radio">Radio</option>
                      </select>
                    </div>
                    {field.type === "radio" && (
                      <input
                        type="text"
                        placeholder="Options (comma-separated)"
                        value={field.options || ""}
                        onChange={(e) =>
                          updateField(field.id, "options", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove Field
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.fields && (
              <div className="flex items-center gap-2 mt-4 text-red-600 text-sm">
                <AlertCircle size={16} />
                {errors.fields}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Link
              href="/admin/dashboard/products"
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Alert Box */}
      <AlertBox
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
    </div>
  );
}
