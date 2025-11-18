"use client";
import React, { useEffect, useState } from "react";
import Notification from "../../../../components/Notification";

interface AboutItem {
  id: string;
  label: string;
  content: string;
}

interface AboutData {
  title: string;
  items: AboutItem[];
}

interface AlertState {
  type: "success" | "error" | null;
  message: string;
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({ type: null, message: "" });

  useEffect(() => {
    fetch("/api/cmsprofile")
      .then((r) => r.json())
      .then((d) => {
        setData({
          title: d.about?.title || "About Us",
          items: d.about?.items || [
            { id: "mission", label: "Our Mission", content: "" },
            { id: "vision", label: "Our Vision", content: "" },
            { id: "values", label: "Our Values", content: "" },
          ],
        });
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error loading about data:", e);
        setAlert({
          type: "error",
          message: `Error loading data: ${String(e)}`,
        });
        setData({
          title: "About Us",
          items: [
            { id: "mission", label: "Our Mission", content: "" },
            { id: "vision", label: "Our Vision", content: "" },
            { id: "values", label: "Our Values", content: "" },
          ],
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
      fullData.about = data;

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
          message: "✓ Data about berhasil disimpan",
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
        <h1>Edit About Section</h1>
        <p style={{ color: "#dc2626" }}>Failed to load about data</p>
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
      <h1 style={{ color: "#1f2937", marginBottom: 8 }}>Edit About Section</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Sesuaikan konten tentang kami untuk halaman utama.
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
              marginBottom: 8,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            About Items
          </label>
          {data.items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                marginBottom: 20,
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
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                Item {idx + 1}: Label
              </label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx] = { ...item, label: e.target.value };
                  setData({ ...data, items: newItems });
                }}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  fontSize: 14,
                  color: "#1f2937",
                  backgroundColor: "#ffffff",
                  marginBottom: 12,
                }}
                placeholder={`e.g., ${item.label}`}
              />

              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                Item {idx + 1}: Content
              </label>
              <textarea
                value={item.content}
                onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx] = { ...item, content: e.target.value };
                  setData({ ...data, items: newItems });
                }}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  minHeight: 100,
                  fontSize: 14,
                  color: "#1f2937",
                  backgroundColor: "#ffffff",
                  fontFamily: "inherit",
                }}
                placeholder="Enter content for this item"
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
            }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
