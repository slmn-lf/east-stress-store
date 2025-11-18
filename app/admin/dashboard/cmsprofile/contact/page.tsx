"use client";
import React, { useEffect, useState } from "react";
import Notification from "../../../../components/Notification";

interface ContactData {
  title: string;
  tagline: string;
  email: string;
  address: string;
  instagram: string;
  tiktok: string;
  recipientEmail: string;
}

interface AlertState {
  type: "success" | "error" | null;
  message: string;
}

export default function ContactPage() {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({ type: null, message: "" });

  useEffect(() => {
    fetch("/api/cmsprofile")
      .then((r) => r.json())
      .then((d) => {
        setData({
          title: d.contact?.title || "",
          tagline: d.contact?.tagline || "",
          email: d.contact?.email || "",
          address: d.contact?.address || "",
          instagram: d.contact?.instagram || "",
          tiktok: d.contact?.tiktok || "",
          recipientEmail: d.contactRecipientEmail || "",
        });
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error loading contact data:", e);
        setAlert({
          type: "error",
          message: `Error loading data: ${String(e)}`,
        });
        setData({
          title: "",
          tagline: "",
          email: "",
          address: "",
          instagram: "",
          tiktok: "",
          recipientEmail: "",
        });
        setLoading(false);
      });
  }, []);

  const save = async () => {
    if (!data) {
      setAlert({ type: "error", message: "Error: No data to save" });
      return;
    }

    try {
      const res = await fetch("/api/cmsprofile");
      if (!res.ok) {
        setAlert({
          type: "error",
          message: `Error fetching current data: ${res.status}`,
        });
        return;
      }

      const fullData = await res.json();
      fullData.contact = data;
      fullData.contactRecipientEmail = data.recipientEmail;

      const saveRes = await fetch("/api/cmsprofile", {
        method: "POST",
        body: JSON.stringify(fullData),
        headers: { "Content-Type": "application/json" },
      });

      if (!saveRes.ok) {
        setAlert({
          type: "error",
          message: `Error saving: HTTP ${saveRes.status}`,
        });
        return;
      }

      const result = await saveRes.json();
      if (result.ok) {
        setAlert({
          type: "success",
          message: "✓ Data contact berhasil disimpan",
        });
      } else {
        setAlert({
          type: "error",
          message: `Error: ${result.error || "Unknown error"}`,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setAlert({ type: "error", message: `Error: ${errorMessage}` });
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Edit Contact Section</h1>
        <p style={{ color: "#dc2626" }}>Failed to load contact data</p>
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
      <h1 style={{ color: "#1f2937", marginBottom: 8 }}>
        Edit Contact Section
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Sesuaikan konten kontak dan link media sosial.
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
            Email Penerima (untuk form submission)
          </label>
          <input
            type="email"
            value={data.recipientEmail}
            onChange={(e) =>
              setData({ ...data, recipientEmail: e.target.value })
            }
            placeholder="admin@example.com"
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
          <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            Email ini akan menerima semua pesan dari contact form
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
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
            Email
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
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
            Tagline
          </label>
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => setData({ ...data, tagline: e.target.value })}
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
            Address
          </label>
          <textarea
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              minHeight: 100,
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
            Instagram Link
          </label>
          <input
            type="url"
            value={data.instagram}
            onChange={(e) => setData({ ...data, instagram: e.target.value })}
            placeholder="https://instagram.com/..."
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
            TikTok Link
          </label>
          <input
            type="url"
            value={data.tiktok}
            onChange={(e) => setData({ ...data, tiktok: e.target.value })}
            placeholder="https://tiktok.com/..."
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
            }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
