export const sendWhatsAppMessage = (phoneNumber: string, message: string) => {
  // Remove any non-digit characters from phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  
  // Open WhatsApp in new window/tab
  window.open(whatsappUrl, '_blank');
};