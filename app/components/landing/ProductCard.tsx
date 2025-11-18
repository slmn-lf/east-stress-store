"use client";

import Image from "next/image";
import styles from "@/app/components/landing/style.module.css";
import { formatPrice } from "@/lib/formatters";

interface ProductCardProps {
  id: string; // Added id property
  name: string;
  description: string | null;
  price: number;
  image: string;
}

export default function ProductCard({
  id, // Keeping id for potential future use
  name,
  description,
  price,
  image,
}: ProductCardProps) {
  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log(`Added ${name} to cart`);
  };

  return (
    <div className={styles["product-card"]}>
      <Image
        className={styles["product-image"]}
        src={image || "/placeholder.png"}
        alt={name}
        width={220}
        height={220}
      />
      <div className={styles["product-info"]}>
        <h4 className={styles["product-title"]}>
          {name.length > 20 ? `${name.slice(0, 20)}...` : name}
        </h4>
        <p className={styles["product-desc"]}>
          {description && description.length > 100
            ? `${description.slice(0, 100)}...`
            : description || "No description available"}
        </p>
        <div className={styles["product-meta"]}>
          <span className={styles["product-price"]}>{formatPrice(price)}</span>
          <button
            className={styles["product-btn"]}
            type="button"
            onClick={() => handleAddToCart()}
          >
            Pre-order
          </button>
        </div>
      </div>
    </div>
  );
}
