"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/app/actions/product-list";
import styles from "@/app/components/landing/style.module.css";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
}

export default function ProductsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const result = await getProducts();
      setProducts(result);
      setLoading(false);
    };
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Products
          </h1>
        </div>

        <div className={styles.productsGrid}>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className={styles["product-card"]}
                style={{ cursor: "pointer" }}
              >
                <Image
                  className={styles["product-image"]}
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.name}
                  width={220}
                  height={220}
                />
                <div className={styles["product-info"]}>
                  <h4 className={styles["product-title"]}>{product.name}</h4>
                  <p className={styles["product-desc"]}>
                    {product.description || "No description available"}
                  </p>
                  <div className={styles["product-meta"]}>
                    <span className={styles["product-price"]}>
                      {formatPrice(product.price)}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className={styles["product-btn"]}
                    >
                      Pesan
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div
            style={{ marginTop: "3rem", textAlign: "center", color: "#cccccc" }}
          >
            No products available.
          </div>
        )}
      </div>
    </div>
  );
}
