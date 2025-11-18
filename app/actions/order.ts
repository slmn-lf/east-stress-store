"use server";

import { prisma } from "@/lib/prisma";

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  quantity: number;
  customFields: Record<string, string | number>;
}

/**
 * Format message untuk WhatsApp dengan data customer dan produk
 */
function formatWhatsAppMessage(
  product: { name: string; price: number },
  formData: OrderFormData,
  customerId: string
): string {
  const price = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(product.price);

  let message = `Halo, saya ingin melakukan pre-order:\n\n`;
  message += ` *Produk*: ${product.name}\n`;
  message += ` *Harga*: ${price}\n`;
  message += ` *Jumlah*: ${formData.quantity}x\n`;
  message += ` *Total*: ${new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(product.price * formData.quantity)}\n\n`;

  message += ` *Data Pelanggan*:\n`;
  message += ` Nama: ${formData.customerName}\n`;
  message += ` Email: ${formData.customerEmail || "-"}\n`;
  message += ` Telepon: ${formData.customerPhone}\n`;
  if (formData.customerAddress) {
    message += ` Alamat: ${formData.customerAddress}\n`;
  }

  // Add custom fields if any
  if (Object.keys(formData.customFields).length > 0) {
    message += `\n *Detail Pesanan*:\n`;
    for (const [key, value] of Object.entries(formData.customFields)) {
      message += `• ${key}: ${value}\n`;
    }
  }

  message += `\n *ID Pesanan*: ${customerId}\n`;
  message += `Terima kasih telah melakukan pre-order!`;

  return message;
}

/**
 * Generate WhatsApp URL dengan message
 */
function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  // Normalize phone number: remove spaces, +, and leading 0
  let normalizedPhone = phoneNumber.replace(/[\s\-\+]/g, "");
  if (normalizedPhone.startsWith("0")) {
    normalizedPhone = "62" + normalizedPhone.substring(1);
  }

  // Encode message untuk URL
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

export async function submitOrder(productId: string, formData: OrderFormData) {
  try {
    // Validate required fields
    if (!formData.customerName?.trim()) {
      return { success: false, error: "Nama pelanggan diperlukan" };
    }
    if (!formData.customerPhone?.trim()) {
      return { success: false, error: "Nomor telepon diperlukan" };
    }
    if (!formData.quantity || formData.quantity < 1) {
      return { success: false, error: "Jumlah pemesanan harus minimal 1" };
    }

    // Get product to verify it exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Produk tidak ditemukan" };
    }

    // Create customer record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma as any).customer.create({
      data: {
        name: formData.customerName.trim(),
        email: formData.customerEmail?.trim() || null,
        phone: formData.customerPhone.trim(),
        address: formData.customerAddress?.trim() || null,
        productId,
        quantity: formData.quantity,
        customFields: JSON.stringify(formData.customFields || {}),
      },
    });

    // Update product's totalPreOrder
    await prisma.product.update({
      where: { id: productId },
      data: {
        totalPreOrder: {
          increment: formData.quantity,
        },
      },
    });

    // Format WhatsApp message with customer data
    const whatsappMessage = formatWhatsAppMessage(
      product,
      formData,
      customer.id
    );

    return {
      success: true,
      customerId: customer.id,
      whatsappMessage,
      productWhatsapp: product.whatsapp,
    };
  } catch (error) {
    console.error("Error submitting order:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.",
    };
  }
}
