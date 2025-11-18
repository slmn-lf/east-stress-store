"use server";

import { prisma } from "@/lib/prisma";

export interface ProductWithImages {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  totalPreOrder: number;
  status: string;
  validUntil: Date | null;
  whatsapp: string;
  createdAt: Date;
  updatedAt: Date;
  additionalFields?: Array<{
    id: string;
    label: string;
    type: string;
    options: string | null;
  }>;
}

export async function getProducts(): Promise<ProductWithImages[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      totalPreOrder: product.totalPreOrder,
      status: product.status,
      validUntil: product.validUntil,
      whatsapp: product.whatsapp,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductById(
  id: string
): Promise<ProductWithImages | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        additionalFields: true,
      },
    });

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      totalPreOrder: product.totalPreOrder,
      status: product.status,
      validUntil: product.validUntil,
      whatsapp: product.whatsapp,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      additionalFields: product.additionalFields,
    };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Delete associated additional fields first
    await prisma.additionalField.deleteMany({
      where: {
        productId: id,
      },
    });

    // Delete product
    await prisma.product.delete({
      where: {
        id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
