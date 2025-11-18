import React from "react";
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
          <form action="#">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </section>
  );
}
