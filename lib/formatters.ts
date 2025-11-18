export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Remove decimals
    maximumFractionDigits: 0, // Remove decimals
  }).format(price);
}
