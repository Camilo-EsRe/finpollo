export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateWhatsAppMessage(
  items: { product: { name: string; price: number }; quantity: number }[],
  total: number,
  customerName?: string,
  customerPhone?: string
): string {
  const lines = items.map(
    (item) =>
      `• ${item.quantity}x ${item.product.name} — ${formatPrice(item.product.price * item.quantity)}`
  );
  const header = '*Nuevo pedido — Distribuidora Fimpollo*%0A%0A';
  const body = lines.join('%0A');
  const totals = `%0A%0A*Total: ${formatPrice(total)}*`;
  const contact =
    customerName || customerPhone
      ? `%0A%0ACliente: ${customerName || '-'}%0ATeléfono: ${customerPhone || '-'}`
      : '';
  return `${header}${body}${totals}${contact}`;
}

export function categoryColors(category: string): string {
  const map: Record<string, string> = {
    Empaques: 'bg-brand-500/15 text-brand-300',
    Limpieza: 'bg-ocean-700/40 text-stone-300',
    Salsas: 'bg-amber-500/15 text-amber-300',
    Otros: 'bg-neutral-700 text-stone-300',
  };
  return map[category] ?? 'bg-neutral-700 text-stone-300';
}
