"use server";

import { prisma } from "@/lib/prisma";

export interface PreOrderWithProduct {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  quantity: number;
  productName: string;
  productId: string;
  customFields: string | null;
  productAdditionalFields?: Array<{
    id: string;
    label: string;
    type: string;
    options: string | null;
  }>;
  createdAt: Date;
}

/**
 * Fetch all pre-orders dengan informasi produk
 */
export async function getAllPreOrders() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers = await (prisma as any).customer.findMany({
      include: {
        product: {
          include: {
            additionalFields: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preOrders: PreOrderWithProduct[] = (customers as any[]).map(
      (customer: any) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        quantity: customer.quantity,
        productName: customer.product.name,
        productId: customer.product.id,
        customFields: customer.customFields,
        productAdditionalFields: customer.product?.additionalFields ?? [],
        createdAt: customer.createdAt,
      })
    );

    return { success: true, data: preOrders };
  } catch (error) {
    console.error("Error fetching pre-orders:", error);
    return { success: false, error: "Gagal mengambil data pre-order" };
  }
}

/**
 * Fetch pre-orders berdasarkan product ID
 */
export async function getPreOrdersByProduct(productId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers = await (prisma as any).customer.findMany({
      where: {
        productId,
      },
      include: {
        product: {
          include: {
            additionalFields: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preOrders: PreOrderWithProduct[] = (customers as any[]).map(
      (customer: any) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        quantity: customer.quantity,
        productName: customer.product.name,
        productId: customer.product.id,
        customFields: customer.customFields,
        productAdditionalFields: customer.product?.additionalFields ?? [],
        createdAt: customer.createdAt,
      })
    );

    return { success: true, data: preOrders };
  } catch (error) {
    console.error("Error fetching pre-orders:", error);
    return { success: false, error: "Gagal mengambil data pre-order" };
  }
}

/**
 * Delete pre-order
 */
export async function deletePreOrder(customerId: string) {
  try {
    // Get customer data sebelum dihapus untuk update product counter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma as any).customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return { success: false, error: "Pre-order tidak ditemukan" };
    }

    // Delete customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).customer.delete({
      where: { id: customerId },
    });

    // Update product totalPreOrder
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalPreOrders = await (prisma as any).customer.count({
      where: { productId: customer.productId },
    });

    await prisma.product.update({
      where: { id: customer.productId },
      data: { totalPreOrder: totalPreOrders },
    });

    return { success: true, message: "Pre-order berhasil dihapus" };
  } catch (error) {
    console.error("Error deleting pre-order:", error);
    return { success: false, error: "Gagal menghapus pre-order" };
  }
}

/**
 * Get pre-order stats
 */
export async function getPreOrderStats() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalOrders = await (prisma as any).customer.count();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalQuantity = await (prisma as any).customer.aggregate({
      _sum: {
        quantity: true,
      },
    });

    return {
      success: true,
      data: {
        totalOrders,
        totalQuantity: totalQuantity._sum.quantity || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching pre-order stats:", error);
    return { success: false, error: "Gagal mengambil statistik" };
  }
}
