// Formats a German phone number to the official WhatsApp standard
export function formatWhatsAppNumber(phone: string | null | undefined) {
  if (!phone) return null;
  
  let cleaned = phone.replace(/\D/g, ''); 
  
  if (cleaned.startsWith('0049')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = '49' + cleaned.substring(1);
  } else if (!cleaned.startsWith('49')) {
    cleaned = '49' + cleaned;
  }
  
  return cleaned;
}