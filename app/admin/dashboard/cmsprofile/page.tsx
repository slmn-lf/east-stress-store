"use client";
import React, { useEffect, useState } from "react";

interface Hero {
  title: string;
  subtitle: string;
  cta: string;
  images: string[];
}

interface CMSProfile {
  hero: Hero;
  about: Record<string, unknown>;
  contact: Record<string, unknown>;
  contactRecipientEmail: string;
  recommendedProducts: string[];
}

export default function CmsProfileAdminPage() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cmsprofile")
      .then((r) => r.json())
      .then((d) => setText(JSON.stringify(d, null, 2)))
      .catch((e) => setStatus(String(e)));
  }, []);

  const validateJSON = (json: CMSProfile) => {
    if (!json.hero) return "Hero data is required.";
    if (!Array.isArray(json.hero.images) || json.hero.images.length < 3)
      return "Hero images must be an array with at least 3 items.";
    if (!json.contactRecipientEmail || json.contactRecipientEmail.trim() === "")
      return "Contact recipient email is required.";
    return null;
  };

  const save = async () => {
    setStatus("Menyimpan...");
    try {
      const payload: CMSProfile = JSON.parse(text);
      const validationError = validateJSON(payload);
      if (validationError) {
        setStatus(validationError);
        return;
      }
      const res = await fetch("/api/cmsprofile", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.ok) setStatus("Tersimpan");
      else setStatus(JSON.stringify(data));
    } catch (err) {
      setStatus("Invalid JSON: " + (err as Error).message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CMS Profile Editor</h1>
      <p>Edit JSON content untuk landing page. Simpan ketika selesai.</p>
      <div style={{ marginTop: 12 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", height: 420, fontFamily: "monospace" }}
        />
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={save} style={{ padding: "0.5rem 1rem" }}>
          Simpan
        </button>
        <div style={{ alignSelf: "center" }}>{status}</div>
      </div>
    </div>
  );
}
