"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Validation helper functions
function validateName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return "Product name is required";
  }
  if (name.trim().length < 3) {
    return "Product name must be at least 3 characters";
  }
  if (name.trim().length > 200) {
    return "Product name must be less than 200 characters";
  }
  return null;
}

function validatePrice(price: number): string | null {
  if (!price || price <= 0) {
    return "Price must be greater than 0";
  }
  if (!Number.isInteger(price)) {
    return "Price must be a whole number";
  }
  if (price > 999999999) {
    return "Price is too high";
  }
  return null;
}

function validateWhatsapp(whatsapp: string): string | null {
  if (!whatsapp || whatsapp.trim().length === 0) {
    return "WhatsApp number is required";
  }
  // Simple validation: should contain digits and optionally + or -
  if (!/^[0-9\-\+\s]+$/.test(whatsapp)) {
    return "WhatsApp number format is invalid";
  }
  if (whatsapp.length < 7) {
    return "WhatsApp number is too short";
  }
  if (whatsapp.length > 20) {
    return "WhatsApp number is too long";
  }
  return null;
}

function validateDescription(description: string | null): string | null {
  if (!description || description.trim().length === 0) {
    return "Description is required";
  }
  if (description.trim().length < 10) {
    return "Description must be at least 10 characters";
  }
  if (description.length > 2000) {
    return "Description must be less than 2000 characters";
  }
  return null;
}

function validateValidUntil(validUntil: string | null): string | null {
  if (!validUntil || validUntil.trim().length === 0) {
    return null; // Optional field
  }
  try {
    const date = new Date(validUntil);
    if (isNaN(date.getTime())) {
      return "Invalid date format";
    }
    if (date < new Date()) {
      return "Valid until date must be in the future";
    }
    return null;
  } catch {
    return "Invalid date format";
  }
}

function validateImageUrls(urls: string[]): string | null {
  if (!urls || urls.length === 0) {
    return "At least one image is required";
  }
  if (urls.length > 3) {
    return "Maximum 3 images allowed";
  }

  for (const url of urls) {
    if (!url || !url.trim()) {
      return "Invalid image URL";
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "Image URLs must start with http:// or https://";
    }
  }
  return null;
}

function validateAdditionalFields(fieldsJson: string | null): string | null {
  if (!fieldsJson || fieldsJson.trim().length === 0) {
    return null; // Optional field
  }

  try {
    const fields = JSON.parse(fieldsJson);

    if (!Array.isArray(fields)) {
      return "Additional fields must be an array";
    }

    if (fields.length > 20) {
      return "Maximum 20 additional fields allowed";
    }

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      if (!field.label || typeof field.label !== "string") {
        return `Field ${i + 1}: Label is required and must be a string`;
      }

      if (field.label.length < 1) {
        return `Field ${i + 1}: Label cannot be empty`;
      }

      if (field.label.length > 100) {
        return `Field ${i + 1}: Label must be less than 100 characters`;
      }

      if (
        !field.type ||
        !["text", "number", "textarea", "radio"].includes(field.type)
      ) {
        return `Field ${i + 1}: Invalid field type`;
      }

      if (field.type === "radio" && field.options) {
        if (typeof field.options !== "string") {
          return `Field ${i + 1}: Options must be a string`;
        }
        const opts = field.options.split(",").map((o: string) => o.trim());
        if (opts.length < 2) {
          return `Field ${i + 1}: Radio must have at least 2 options`;
        }
      }
    }

    return null;
  } catch (error) {
    return "Invalid additional fields format";
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const validUntil = formData.get("validUntil") as string;
    const additionalFieldsJson = formData.get("additionalFields") as string;

    console.log("Server: Creating product:", { name, priceStr, whatsapp });

    // Parse and validate price
    const price = parseInt(priceStr) || 0;

    // Validate all fields
    const nameError = validateName(name);
    if (nameError) {
      return { success: false, error: nameError };
    }

    const priceError = validatePrice(price);
    if (priceError) {
      return { success: false, error: priceError };
    }

    const whatsappError = validateWhatsapp(whatsapp);
    if (whatsappError) {
      return { success: false, error: whatsappError };
    }

    const descriptionError = validateDescription(description);
    if (descriptionError) {
      return { success: false, error: descriptionError };
    }

    const validUntilError = validateValidUntil(validUntil);
    if (validUntilError) {
      return { success: false, error: validUntilError };
    }

    // Get uploaded image URLs
    const imageUrls: string[] = [];
    const urls = formData.getAll("imageUrls") as string[];

    console.log(`Server: Received ${urls.length} image URLs`);

    for (const url of urls) {
      if (url && url.trim()) {
        imageUrls.push(url);
      }
    }

    const imageError = validateImageUrls(imageUrls);
    if (imageError) {
      return { success: false, error: imageError };
    }

    const fieldsError = validateAdditionalFields(additionalFieldsJson);
    if (fieldsError) {
      return { success: false, error: fieldsError };
    }

    console.log(`Server: Creating product with ${imageUrls.length} images`);

    // Create product
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(), // Now required, no null
        price,
        images: imageUrls,
        whatsapp: whatsapp.trim(),
        validUntil:
          validUntil && validUntil.trim() ? new Date(validUntil) : null,
        status: "active",
        totalPreOrder: 0,
      },
    });

    console.log(`Server: Product created successfully with ID: ${product.id}`);

    // Create additional fields jika ada
    if (additionalFieldsJson && additionalFieldsJson.trim().length > 0) {
      try {
        const fields = JSON.parse(additionalFieldsJson);
        if (Array.isArray(fields) && fields.length > 0) {
          console.log(`Server: Creating ${fields.length} additional fields`);
          await prisma.additionalField.createMany({
            data: fields.map((f) => ({
              productId: product.id,
              label: f.label.trim(),
              type: f.type,
              options: f.options ? f.options.trim() : null,
            })),
          });
          console.log("Server: Additional fields created successfully");
        }
      } catch (error) {
        console.warn("Server: Failed to parse additional fields:", error);
      }
    }

    revalidatePath("/admin/dashboard/products");
    console.log("Server: Path revalidated");

    return { success: true, product };
  } catch (error) {
    console.error("Server: Create product error:", error);

    // Log detailed error info
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}
