export interface WhatsAppCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function generateWhatsAppCartLink(
  items: WhatsAppCartItem[],
  total: number,
  couponCode?: string
): string {
  const phoneNumber = '56985633114';
  
  let message = 'Hola! Me gustaria realizar el siguiente pedido:\n\n';
  
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. ${item.name}\n`;
    message += `   Cantidad: ${item.quantity}\n`;
    message += `   Precio: $${item.price.toLocaleString('es-CL')}\n`;
    message += `   Subtotal: $${itemTotal.toLocaleString('es-CL')}\n\n`;
  });

  if (couponCode) {
    message += `Cupon aplicado: ${couponCode}\n\n`;
  }

  message += `TOTAL: $${total.toLocaleString('es-CL')}\n\n`;
  message += 'Gracias!';

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function generateWhatsAppLink(productName: string, price: number): string {
  const phoneNumber = '56985633114';
  
  const message = `Hola! Me interesa el producto:\n\n` +
    `${productName}\n` +
    `Precio: $${price.toLocaleString('es-CL')}\n\n` +
    `Podrian darme mas informacion?`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}