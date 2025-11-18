import Link from "next/link";
import styles from "@/app/components/landing/style.module.css";
import { getProducts } from "@/app/actions/product-list";
import ProductCard from "./ProductCard";

export default async function ProductsSection() {
  const products = await getProducts();
  const displayedProducts = products.slice(0, 5);

  return (
    <section className={styles.products}>
      <div className={styles.title}>
        <h2>Products</h2>
      </div>
      <div className={styles["container-products"]}>
        <div className={styles.productsGrid}>
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.images[0]}
            />
          ))}
        </div>
        <div style={{ width: "100%", textAlign: "left", marginTop: 16 }}>
          <Link
            href="/products"
            style={{
              color: "#f15209",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Other products...
          </Link>
        </div>
      </div>
    </section>
  );
}
