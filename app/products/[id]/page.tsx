import { getProductById } from "@/app/actions/product-list";
import { notFound } from "next/navigation";
import React from "react";
import ImageCarousel from "./ImageCarousel";
import ProductOrderForm from "./ProductOrderForm";

interface ProductPageProps {
  params: Promise<{
    id: string; // The dynamic segment 'id' will be a string
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);

  const formatDate = (d: Date | null | undefined) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="max-w-6xl mx-auto pt-8 md:pt-20 pb-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <ImageCarousel
            images={product.images || []}
            alt={product.name}
            status={product.status}
          />

          <div className="w-full mt-6">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="mb-4 text-gray-700">{product.description || "-"}</p>
            <div className="mb-3">
              Harga:{" "}
              <span className="font-semibold">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="mb-3 text-sm">
              <div>Akan di tutup : {formatDate(product.validUntil)}</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <ProductOrderForm
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              whatsapp: product.whatsapp,
              additionalFields: product.additionalFields || [],
              status: product.status,
            }}
          />
        </div>
      </div>
    </main>
  );
}
