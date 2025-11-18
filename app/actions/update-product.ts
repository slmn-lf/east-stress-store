"use server";

import { prisma } from "@/lib/prisma";

export interface UpdateProductData {
  name: string;
  description: string;
  price: number;
  whatsapp: string;
  validUntil: string;
  images?: string[];
  additionalFields?: Array<{
    label: string;
    type: string;
    options: string | null;
  }>;
}

export async function updateProduct(
  id: string,
  data: UpdateProductData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate
    if (!data.name || data.name.trim().length < 3) {
      return { success: false, error: "Name must be at least 3 characters" };
    }

    if (!data.description || data.description.trim().length < 10) {
      return {
        success: false,
        error: "Description must be at least 10 characters",
      };
    }

    if (!data.price || data.price <= 0) {
      return { success: false, error: "Price must be greater than 0" };
    }

    if (!data.whatsapp || data.whatsapp.trim().length === 0) {
      return { success: false, error: "WhatsApp is required" };
    }

    if (!data.validUntil || data.validUntil.trim().length === 0) {
      return { success: false, error: "Valid until date is required" };
    }

    const date = new Date(data.validUntil);
    if (isNaN(date.getTime())) {
      return { success: false, error: "Invalid date format" };
    }

    if (date < new Date()) {
      return {
        success: false,
        error: "Valid until date must be in the future",
      };
    }

    if (data.images && data.images.length === 0) {
      return { success: false, error: "At least 1 image is required" };
    }

    if (
      data.additionalFields &&
      (data.additionalFields.length === 0 || data.additionalFields.length > 20)
    ) {
      return {
        success: false,
        error: "Additional fields must be between 1 and 20",
      };
    }

    // Update product
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        whatsapp: data.whatsapp.trim(),
        validUntil: new Date(data.validUntil),
        ...(data.images && { images: data.images }),
      },
    });

    // Update additional fields if provided
    if (data.additionalFields && data.additionalFields.length > 0) {
      // Delete existing fields
      await prisma.additionalField.deleteMany({
        where: { productId: id },
      });

      // Create new fields
      const fieldsToCreate = data.additionalFields.map((f) => ({
        label: f.label,
        type: f.type,
        options: f.options,
        productId: id,
      }));

      await prisma.additionalField.createMany({
        data: fieldsToCreate,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Update product error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}
