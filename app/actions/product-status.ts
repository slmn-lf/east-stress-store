"use server";

import { prisma } from "@/lib/prisma";

export async function toggleProductStatus(
  productId: string,
  status: "active" | "inactive"
): Promise<{
  success: boolean;
  error?: string;
  data?: { id: string; status: string };
}> {
  try {
    if (!productId) {
      return { success: false, error: "Product ID is required" };
    }

    if (!["active", "inactive"].includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { status },
    });

    return {
      success: true,
      data: { id: product.id, status: product.status },
    };
  } catch (error) {
    console.error("Toggle product status error:", error);
    return {
      success: false,
      error: "Failed to update product status",
    };
  }
}
