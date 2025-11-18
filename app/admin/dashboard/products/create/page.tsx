"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/actions/product";

const DEFAULT_WHATSAPP = "+6281234567890"; // default from store profile (hardcoded for now)

// Image compression utility
async function compressImage(file: File): Promise<File> {
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

        // Resize if larger than 1200px
        const maxSize = 1200;
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          0.7
        );
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
  });
}

export default function CreateProductPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [validEnabled, setValidEnabled] = useState(false);
  const [validUntil, setValidUntil] = useState("");
  const [whatsapp, setWhatsapp] = useState(DEFAULT_WHATSAPP);
  const [isLoading, setIsLoading] = useState(false);
  const [additionalFields, setAdditionalFields] = useState<
    {
      id: number;
      label: string;
      type: "text" | "number" | "textarea" | "radio";
      options?: string;
      required: boolean;
    }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const newFiles = [...files, ...selected];

    if (newFiles.length > 3) {
      alert("Maximum 3 images allowed");
      setFiles(newFiles.slice(0, 3));
      return;
    }

    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => setFiles([]);

  const addField = () => {
    setAdditionalFields((prev) => [
      ...prev,
      { id: Date.now(), label: "Question", type: "text", required: true },
    ]);
  };

  const updateField = (
    id: number,
    key: "label" | "type" | "options" | "required",
    value: string | boolean
  ) => {
    setAdditionalFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const removeField = (id: number) => {
    setAdditionalFields((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create Product (Pre-order)</h1>
          <p className="text-sm text-gray-600">
            Fill the details for a new pre-order product.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/dashboard/products"
            className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            // Create not wired yet
          >
            Create
          </button>
        </div>
      </div>

      {/* Photos */}
      <section className="mb-6 bg-white p-4 rounded-md shadow">
        <h2 className="font-semibold mb-2">Photos *</h2>
        <p className="text-sm text-gray-500 mb-3">
          Upload multiple photos. You can review selected images before
          creating.
        </p>

        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <div className="border border-dashed border-gray-300 rounded-md p-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={onFileChange}
                className="block w-full text-sm text-gray-600"
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReview(true)}
                  disabled={files.length === 0}
                  className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm disabled:opacity-50"
                >
                  Review Photos ({files.length}/3)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current && (fileInputRef.current.value = "")
                  }
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  Clear Input
                </button>
                <button
                  type="button"
                  onClick={clearFiles}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  Remove All Selected
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {files.length > 0 && (
              <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-3">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="relative rounded overflow-hidden border"
                  >
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-md max-w-3xl w-full p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Review Selected Photos</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReview(false)}
                    className="px-3 py-1 rounded-md border text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {files.map((f, i) => (
                  <div key={i} className="border rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-2 text-sm">
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-gray-500">
                        {(f.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Form */}
      <section className="mb-6 bg-white p-4 rounded-md shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 text-gray-900"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 block w-full border rounded-md p-2 text-gray-900"
              placeholder="0.00"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 h-32 text-gray-900"
              placeholder="Describe your product / pre-order details"
            />
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Valid Until *
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="border rounded-md p-2 text-gray-900"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              WhatsApp (direct) *
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 text-gray-900"
              placeholder="+628..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Default taken from store profile.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Dynamic Form */}
      <section className="mb-6 bg-white p-4 rounded-md shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Additional Form (Dynamic) *</h3>
            <p className="text-xs text-gray-500 mt-1">
              At least 1 field is required
            </p>
          </div>
          <div>
            <button
              onClick={addField}
              disabled={additionalFields.length >= 20}
              className="px-3 py-1 text-sm rounded-md bg-gray-800 text-white disabled:opacity-50"
            >
              Add Field
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {additionalFields.length === 0 && (
            <p className="text-sm text-gray-500">No additional fields yet.</p>
          )}

          {additionalFields.map((f) => (
            <div key={f.id}>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  type="text"
                  value={f.label}
                  onChange={(e) => updateField(f.id, "label", e.target.value)}
                  className="flex-1 border rounded-md p-2 text-gray-900"
                  placeholder="Question label"
                />

                <select
                  value={f.type}
                  onChange={(e) => updateField(f.id, "type", e.target.value)}
                  className="border rounded-md p-2 text-gray-900 md:w-auto"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="textarea">Textarea</option>
                  <option value="radio">Radio</option>
                </select>

                <label className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={f.required}
                    onChange={(e) =>
                      updateField(
                        f.id,
                        "required",
                        e.target.checked ? "true" : "false"
                      )
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Required</span>
                </label>

                <button
                  onClick={() => removeField(f.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  title="Remove field"
                >
                  Remove
                </button>
              </div>

              {f.type === "radio" && (
                <div className="mt-2">
                  <label className="text-xs text-gray-600 block mb-1">
                    Options (comma separated)
                  </label>
                  <input
                    type="text"
                    value={f.options || ""}
                    onChange={(e) =>
                      updateField(f.id, "options", e.target.value)
                    }
                    className="w-full border rounded-md p-2 text-sm text-gray-900"
                    placeholder="Option 1,Option 2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/dashboard/products"
          className="px-4 py-2 border rounded-md"
        >
          Cancel
        </Link>
        <button
          type="submit"
          form="create-form"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </div>

      <form id="create-form" onSubmit={handleSubmit} className="hidden" />
    </div>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Client-side validation
      const nameError = validateName(name);
      if (nameError) {
        alert(nameError);
        setIsLoading(false);
        return;
      }

      const priceError = validatePrice(price);
      if (priceError) {
        alert(priceError);
        setIsLoading(false);
        return;
      }

      const descriptionError = validateDescription(description);
      if (descriptionError) {
        alert(descriptionError);
        setIsLoading(false);
        return;
      }

      const whatsappError = validateWhatsapp(whatsapp);
      if (whatsappError) {
        alert(whatsappError);
        setIsLoading(false);
        return;
      }

      const validUntilError = validateValidUntil(validUntil, true);
      if (validUntilError) {
        alert(validUntilError);
        setIsLoading(false);
        return;
      }

      if (files.length === 0) {
        alert("At least one image is required");
        setIsLoading(false);
        return;
      }

      if (files.length > 3) {
        alert("Maximum 3 images allowed");
        setIsLoading(false);
        return;
      }

      const fieldsError = validateAdditionalFields(additionalFields);
      if (fieldsError) {
        alert(fieldsError);
        setIsLoading(false);
        return;
      }

      console.log("All validations passed");
      console.log("Files to upload:", files.length);

      // Compress images before upload
      console.log("Compressing images...");
      const compressedFiles: File[] = [];
      for (const file of files) {
        try {
          console.log(`Compressing ${file.name}...`);
          const compressed = await compressImage(file);
          console.log(
            `Compressed: ${file.name} (${(file.size / 1024).toFixed(1)}KB) -> ${(compressed.size / 1024).toFixed(1)}KB`
          );
          compressedFiles.push(compressed);
        } catch (error) {
          console.error(`Failed to compress ${file.name}:`, error);
          alert(`Failed to compress image ${file.name}`);
          setIsLoading(false);
          return;
        }
      }

      console.log("Images compressed, uploading to Cloudinary...");

      // Upload files to Cloudinary via API endpoint
      const uploadedUrls: string[] = [];

      for (const file of compressedFiles) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);

          console.log(`Uploading ${file.name}...`);
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error(
              `Upload failed for ${file.name}: ${uploadResponse.statusText}`
            );
          }

          const uploadData = await uploadResponse.json();
          if (uploadData.success && uploadData.url) {
            uploadedUrls.push(uploadData.url);
            console.log(`Successfully uploaded: ${uploadData.url}`);
          } else {
            throw new Error(uploadData.error || "Upload failed");
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          alert(`Failed to upload image ${file.name}`);
          setIsLoading(false);
          return;
        }
      }

      console.log("All files uploaded successfully, creating product...");

      // Create product on server with only URLs (much smaller payload)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description || "");
      formData.append("price", price.toString());
      formData.append("whatsapp", whatsapp);
      formData.append("validUntil", validUntil);

      // Add uploaded image URLs instead of files
      uploadedUrls.forEach((url) => formData.append("imageUrls", url));

      // Add additional fields as JSON (now required)
      const fieldsForDb = additionalFields.map((f) => ({
        label: f.label,
        type: f.type,
        options: f.options || null,
        required: f.required,
      }));
      formData.append("additionalFields", JSON.stringify(fieldsForDb));

      console.log("Calling createProduct action...");
      const result = await createProduct(formData);

      console.log("Server response:", result);

      if (result.success) {
        alert("Product created successfully!");
        router.push("/admin/dashboard/products");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An error occurred while creating the product");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Validation helper functions (mirror server-side validation)
  function validateName(name: string): string | null {
    if (!name || name.trim().length === 0) {
      return "Product name is required";
    }
    if (name.trim().length < 3) {
      return "Product name must be at least 3 characters";
    }
    if (name.trim().length > 200) {
      return "Product name must be less than 200 characters";
    }
    return null;
  }

  function validatePrice(price: number): string | null {
    if (!price || price <= 0) {
      return "Price must be greater than 0";
    }
    if (!Number.isInteger(price)) {
      return "Price must be a whole number";
    }
    if (price > 999999999) {
      return "Price is too high";
    }
    return null;
  }

  function validateDescription(description: string): string | null {
    if (!description || description.trim().length === 0) {
      return "Description is required";
    }
    if (description.trim().length < 10) {
      return "Description must be at least 10 characters";
    }
    if (description.length > 2000) {
      return "Description must be less than 2000 characters";
    }
    return null;
  }

  function validateWhatsapp(whatsapp: string): string | null {
    if (!whatsapp || whatsapp.trim().length === 0) {
      return "WhatsApp number is required";
    }
    if (!/^[0-9\-\+\s]+$/.test(whatsapp)) {
      return "WhatsApp number format is invalid";
    }
    if (whatsapp.length < 7) {
      return "WhatsApp number is too short";
    }
    if (whatsapp.length > 20) {
      return "WhatsApp number is too long";
    }
    return null;
  }

  function validateValidUntil(
    validUntil: string,
    validEnabled: boolean
  ): string | null {
    // Valid until is now required
    if (!validUntil || validUntil.trim().length === 0) {
      return "Valid until date is required";
    }
    try {
      const date = new Date(validUntil);
      if (isNaN(date.getTime())) {
        return "Invalid date format";
      }
      if (date < new Date()) {
        return "Valid until date must be in the future";
      }
      return null;
    } catch {
      return "Invalid date format";
    }
  }

  function validateAdditionalFields(
    fields: Array<{
      id: number;
      label: string;
      type: "text" | "number" | "textarea" | "radio";
      options?: string;
      required: boolean;
    }>
  ): string | null {
    // Additional fields are now required
    if (!fields || fields.length === 0) {
      return "At least 1 additional field is required";
    }

    if (fields.length > 20) {
      return "Maximum 20 additional fields allowed";
    }

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      if (!field.label || field.label.trim().length === 0) {
        return `Field ${i + 1}: Label cannot be empty`;
      }

      if (field.label.length < 1) {
        return `Field ${i + 1}: Label is required`;
      }

      if (field.label.length > 100) {
        return `Field ${i + 1}: Label must be less than 100 characters`;
      }

      if (field.type === "radio" && field.options) {
        const opts = field.options
          .split(",")
          .map((o) => o.trim())
          .filter((o) => o);
        if (opts.length < 2) {
          return `Field ${i + 1}: Radio must have at least 2 options`;
        }
      }
    }

    return null;
  }
}
