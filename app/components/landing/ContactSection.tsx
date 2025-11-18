"use client";

import React, { useState } from "react";
import styles from "./style.module.css";
import { Instagram, Music3 } from "lucide-react";

interface ContactData {
  title: string;
  tagline: string;
  email: string;
  address: string;
  instagram: string;
  tiktok: string;
}

export default function ContactSection({ data }: { data: unknown }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const defaultContact: ContactData = {
    title: "Contact Us",
    tagline: "Art never dead",
    email: "Eaststress@gmail.com",
    address: "123 Main Street, City, Country",
    instagram: "https://instagram.com/eaststressstore",
    tiktok: "https://tiktok.com/@eaststressstore",
  };

  const contact =
    data && typeof data === "object" && "contact" in data
      ? {
          ...defaultContact,
          ...(data as { contact?: Partial<ContactData> }).contact,
        }
      : defaultContact;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✓ Pesan berhasil dikirim!");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage(`Error: ${result.error || "Gagal mengirim pesan"}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("Error: Gagal mengirim pesan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles["header-contact"]}>
        <div className={styles.logo}>
          <img src="/assets/logo.svg" alt="Logo" width={40} height={40} />
          <h1>EAST STRESS STORE.</h1>
        </div>
        <div className={styles.sosmed}>
          <a
            href={contact.instagram}
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram />
          </a>
          <a
            href={contact.tiktok}
            aria-label="Tiktok"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Music3 />
          </a>
        </div>
      </div>
      <div className={styles["body-contact"]}>
        <div className={styles["info-contact"]}>
          <h2>{contact.title}</h2>
          <div className={styles["contact-item"]}></div>
          <p>Gmail : {contact.email}</p>
          <p>Address : {contact.address}</p>
          <p className={styles["end-item"]}>{contact.tagline}</p>
        </div>
        <div className={styles["form-contact"]}>
          <h2>Send a Message</h2>
          {message && (
            <div
              style={{
                marginBottom: "12px",
                padding: "8px 12px",
                borderRadius: "4px",
                backgroundColor: message.includes("✓") ? "#d1fae5" : "#fee2e2",
                color: message.includes("✓") ? "#065f46" : "#991b1b",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
