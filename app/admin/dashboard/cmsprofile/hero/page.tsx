"use client";
import React, { useEffect, useState } from "react";
import Notification from "../../../../components/Notification";

interface HeroData {
  title: string;
  subtitle: string;
  cta: string;
  images: string[];
}

interface AlertState {
  type: "success" | "error" | null;
  message: string;
}

export default function HeroPage() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [previews, setPreviews] = useState<{ [key: number]: string }>({});
  const [alert, setAlert] = useState<AlertState>({ type: null, message: "" });

  useEffect(() => {
    fetch("/api/cmsprofile")
      .then((r) => r.json())
      .then((d) => {
        // Ensure data has default values if missing
        setData({
          title: d.hero?.title || "",
          subtitle: d.hero?.subtitle || "",
          cta: d.hero?.cta || "",
          images: d.hero?.images || ["", "", ""],
        });
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error loading hero data:", e);
        setAlert({
          type: "error",
          message: `Error loading data: ${String(e)}`,
        });
        // Set default data on error
        setData({
          title: "",
          subtitle: "",
          cta: "",
          images: ["", "", ""],
        });
        setLoading(false);
      });
  }, []);

  const save = async () => {
    if (!data) {
      setAlert({ type: "error", message: "Error: No data to save" });
      console.error("Save failed: data is null");
      return;
    }

    console.log("Saving hero data:", data);
    try {
      const res = await fetch("/api/cmsprofile");
      if (!res.ok) {
        const errorMsg = `Error fetching current data: ${res.status}`;
        setAlert({ type: "error", message: errorMsg });
        console.error(errorMsg);
        return;
      }

      const fullData = await res.json();
      fullData.hero = data;
      console.log("Full data to save:", fullData);

      const saveRes = await fetch("/api/cmsprofile", {
        method: "POST",
        body: JSON.stringify(fullData),
        headers: { "Content-Type": "application/json" },
      });

      if (!saveRes.ok) {
        const errorMsg = `Error saving: HTTP ${saveRes.status}`;
        setAlert({ type: "error", message: errorMsg });
        console.error(errorMsg);
        return;
      }

      const result = await saveRes.json();
      console.log("Save response:", result);
      if (result.ok) {
        setAlert({ type: "success", message: "✓ Data hero berhasil disimpan" });
      } else {
        setAlert({
          type: "error",
          message: `Error: ${result.error || "Unknown error"}`,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setAlert({
        type: "error",
        message: `Error: ${errorMessage}`,
      });
      console.error("Save error:", error);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    if (data) {
      const newImages = [...data.images];
      newImages[index] = value;
      setData({ ...data, images: newImages });
    }
  };

  const handleImageUpload = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((prev) => ({
        ...prev,
        [index]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.url) {
        handleImageChange(index, result.url);
        setAlert({
          type: "success",
          message: `✓ Gambar ${index + 1} berhasil diupload`,
        });
      } else {
        setAlert({
          type: "error",
          message: `Gagal upload gambar ${index + 1}: ${result.error}`,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setAlert({
        type: "error",
        message: `Upload error: ${errorMessage}`,
      });
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Edit Hero Section</h1>
        <p style={{ color: "#dc2626" }}>Failed to load hero data</p>
      </div>
    );
  }

  return (
    <div
      style={{ padding: 20, backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <style>{`
        input, textarea {
          background-color: white !important;
          color: #1f2937 !important;
        }
        input:focus, textarea:focus {
          background-color: #f0f9ff !important;
        }
      `}</style>
      {alert.type && (
        <Notification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: null, message: "" })}
        />
      )}
      <h1 style={{ color: "#1f2937", marginBottom: 8 }}>Edit Hero Section</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Sesuaikan konten hero untuk halaman utama.
      </p>

      <div
        style={{
          marginTop: 20,
          backgroundColor: "white",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontSize: 14,
              color: "#1f2937",
              backgroundColor: "#ffffff",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            Subtitle
          </label>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontSize: 14,
              color: "#1f2937",
              backgroundColor: "#ffffff",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            CTA Button Text
          </label>
          <input
            type="text"
            value={data.cta}
            onChange={(e) => setData({ ...data, cta: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontSize: 14,
              color: "#1f2937",
              backgroundColor: "#ffffff",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            Images
          </label>
          {data.images.map((img, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 16,
                padding: 16,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                backgroundColor: "#f9fafb",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Image {idx + 1}
              </label>

              {/* Image Preview */}
              {(previews[idx] || img) && (
                <div style={{ marginBottom: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previews[idx] || img}
                    alt={`Hero ${idx + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              {/* File Upload Input */}
              <div style={{ marginBottom: 8 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(idx, e)}
                  disabled={uploading === idx}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 8,
                    border: "1px dashed #2563eb",
                    borderRadius: 4,
                    cursor: uploading === idx ? "not-allowed" : "pointer",
                    backgroundColor: "#eff6ff",
                    opacity: uploading === idx ? 0.5 : 1,
                  }}
                />
                <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  {uploading === idx
                    ? "Uploading..."
                    : "Upload PNG, JPG, atau GIF (max 5MB)"}
                </p>
              </div>

              {/* Manual URL Input */}
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: 13,
                  color: "#666",
                }}
              >
                atau paste URL langsung:
              </label>
              <input
                type="text"
                value={img}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontFamily: "monospace",
                  fontSize: 12,
                }}
                placeholder="https://..."
              />
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 24,
            alignItems: "center",
          }}
        >
          <button
            onClick={save}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 500,
              transition: "background-color 0.2s",
            }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
