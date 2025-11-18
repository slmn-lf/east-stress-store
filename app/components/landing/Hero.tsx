import React from "react";

import styles from "./style.module.css";
import ImageSlider from "./ImageSlider";

export default function Hero({ data }: { data: unknown }) {
  const hero =
    data && typeof data === "object" && "hero" in data
      ? (
          data as {
            hero?: {
              title?: string;
              subtitle?: string;
              cta?: string;
              images?: string[];
            };
          }
        ).hero
      : {};
  return (
    <section
      className={`${styles.hero} ${styles.heroMobile}`}
      style={{ marginTop: 0 }}
    >
      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <h1>{hero?.title}</h1>
          <p>{hero?.subtitle}</p>
        </div>
        <div className={styles.heroSlider}>
          <ImageSlider images={hero?.images} />
        </div>
      </div>
    </section>
  );
}
