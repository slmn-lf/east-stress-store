"use client";

import Image from "next/image";
import styles from "@/app/components/landing/style.module.css";
import { formatPrice } from "@/lib/formatters";
import Link from "next/link";

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
      <Link
        href={id ? `/products/${id}` : "#"}
        className={styles["product-card-link"]}
      >
        <Image
          className={styles["product-image"]}
          src={image || "/placeholder.png"}
          alt={name}
          width={220}
          height={220}
        />
      </Link>
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
          <Link
            href={id ? `/products/${id}` : "#"}
            className={styles["product-btn"]}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => id && handleAddToCart()}
          >
            Pesan
          </Link>
        </div>
      </div>
    </div>
  );
}
