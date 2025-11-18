/**
 * Utility functions untuk WhatsApp integration
 * File ini tidak menggunakan "use server" sehingga dapat di-import dari client components
 */

/**
 * Generate WhatsApp URL dengan message
 */
export function generateWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {
  // Normalize phone number: remove spaces, +, and leading 0
  let normalizedPhone = phoneNumber.replace(/[\s\-\+]/g, "");
  if (normalizedPhone.startsWith("0")) {
    normalizedPhone = "62" + normalizedPhone.substring(1);
  }

  // Encode message untuk URL
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}
