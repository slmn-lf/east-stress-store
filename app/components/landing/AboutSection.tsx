import React from "react";
import styles from "./style.module.css";

interface AboutItem {
  id: string;
  label: string;
  content: string;
}

interface AboutData {
  title: string;
  items?: AboutItem[];
}

export default function AboutSection({ data }: { data: unknown }) {
  const about =
    data && typeof data === "object" && "about" in data
      ? (data as { about?: AboutData }).about
      : { title: "About Us", items: [] };

  const items = about?.items || [];

  return (
    <section className={styles.about}>
      <div className={styles.aboutContainer}>
        <div className={styles.title}>
          <h2>{about?.title || "About Us"}</h2>
        </div>
        <div className={styles.col}>
          {items.length > 0 ? (
            items.map((item: AboutItem) => (
              <div key={item.id} className={styles.cols}>
                <h3>{item.label}</h3>
                <p>{item.content}</p>
              </div>
            ))
          ) : (
            <>
              <div className={styles.cols}>
                <h3>Our Mission</h3>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
              </div>
              <div className={styles.cols}>
                <h3>Our Vision</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </div>
              <div className={styles.cols}>
                <h3>Our Values</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
