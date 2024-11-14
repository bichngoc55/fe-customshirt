export const calculateDeliveryDate = (deliveryType) => {
  const today = new Date();
  let deliveryDate = new Date(today);

  switch (deliveryType.toLowerCase()) {
    case "standard":
      deliveryDate.setDate(today.getDate() + 5);
      break;
    case "express":
      deliveryDate.setDate(today.getDate() + 3);
      break;
    case "same day":
      deliveryDate.setHours(23, 59, 59, 999);
      break;
    default:
      deliveryDate.setDate(today.getDate() + 5);
  }

  return deliveryDate;
};

export const generateTransactionId = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `TXN${timestamp}${random}`;
};
export const detectCardType = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/[\s-]/g, "");

  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    dinersclub: /^3(?:0[0-5]|[68])/,
    jcb: /^(?:2131|1800|35\d{3})/,
  };

  for (const [cardType, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleanNumber)) {
      return cardType.charAt(0).toUpperCase() + cardType.slice(1);
    }
  }

  return "Unknown";
};
