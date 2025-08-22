import { Product } from "@shared/data";

// Re-export shared data
export * from "@shared/data";

// WhatsApp contact function (client-only)
export const openWhatsApp = (product: Product) => {
  const phoneNumber = "+1234567890"; // Replace with your actual WhatsApp number
  const message = encodeURIComponent(
    product.whatsappMessage ||
      `Hi! I'm interested in ${product.name}. Could you tell me more about it?`,
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");
};
