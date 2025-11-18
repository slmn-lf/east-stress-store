"use client";
import React, { useEffect, useState } from "react";

export default function CmsProfileAdminPage() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cmsprofile")
      .then((r) => r.json())
      .then((d) => setText(JSON.stringify(d, null, 2)))
      .catch((e) => setStatus(String(e)));
  }, []);

  const save = async () => {
    setStatus("Menyimpan...");
    try {
      const payload = JSON.parse(text);
      const res = await fetch("/api/cmsprofile", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.ok) setStatus("Tersimpan");
      else setStatus(JSON.stringify(data));
    } catch (err: any) {
      setStatus("Invalid JSON: " + err.message);
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
