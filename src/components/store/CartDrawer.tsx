import { useEffect, useState } from 'react';
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  MessageCircle,
  ArrowRight,
  Loader2,
  User as UserIcon,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, generateWhatsAppMessage } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import Modal from '../ui/Modal';

const WHATSAPP_NUMBER = '573001234567';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useStore();
  const { user } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [needLoginOpen, setNeedLoginOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setCheckoutOpen(false);
      setOrderPlaced(false);
      setSaveError('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCheckoutClick = () => {
    if (!user) {
      setNeedLoginOpen(true);
      return;
    }
    setCheckoutOpen(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    if (user) {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_phone: form.phone,
          total: cartTotal,
          status: 'pendiente',
        })
        .select()
        .single();

      if (orderError || !orderData) {
        setSaveError('No se pudo guardar el pedido. Intenta de nuevo.');
        setSaving(false);
        return;
      }

      const items = cart.map((item) => ({
        order_id: orderData.id,
        product_name: item.product.name,
        product_price: item.product.price,
        product_image: item.product.image,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items);

      if (itemsError) {
        setSaveError('No se pudieron guardar los productos del pedido.');
        setSaving(false);
        return;
      }
    }

    const message = generateWhatsAppMessage(cart, cartTotal, form.name, form.phone);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');

    setOrderPlaced(true);
    clearCart();
    setSaving(false);
    setTimeout(() => {
      setOrderPlaced(false);
      setCheckoutOpen(false);
      setForm({ name: '', phone: '' });
      onClose();
    }, 2500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

        <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-neutral-800 bg-neutral-900 shadow-2xl animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-400" />
              <h2 className="font-display text-lg font-bold text-stone-100">
                Carrito {cartCount > 0 && `(${cartCount})`}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-neutral-800 hover:text-stone-200"
              aria-label="Cerrar carrito"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
                  <ShoppingBag className="h-7 w-7 text-stone-500" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-stone-300">
                  Tu carrito está vacío
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  Agrega productos desde el catálogo.
                </p>
                <button onClick={onClose} className="btn-primary mt-5">
                  Explorar catálogo
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {cart.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex gap-3 rounded-xl border border-neutral-800 p-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold leading-tight text-stone-100 line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex-shrink-0 rounded p-1 text-stone-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 rounded-lg border border-neutral-700 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-neutral-800"
                            aria-label="Disminuir"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-semibold text-stone-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-neutral-800"
                            aria-label="Aumentar"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-sm font-bold text-brand-400">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-neutral-800 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-stone-500">Total</span>
                <span className="font-display text-2xl font-extrabold text-stone-100">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <button
                onClick={handleCheckoutClick}
                className="btn-primary w-full justify-between py-3"
              >
                Hacer pedido
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={clearCart}
                className="mt-2 w-full text-center text-xs font-medium text-stone-500 transition-colors hover:text-red-400"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Need login modal */}
      <Modal
        open={needLoginOpen}
        onClose={() => setNeedLoginOpen(false)}
        title="Inicia sesión para pedir"
        size="sm"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15">
            <UserIcon className="h-7 w-7 text-brand-400" />
          </div>
          <p className="mt-4 text-sm text-stone-300">
            Necesitas una cuenta para hacer un pedido. Así podremos guardar tu
            historial y podrás repetir tus compras anteriores fácilmente.
          </p>
        </div>
        <button
          onClick={() => {
            setNeedLoginOpen(false);
            onClose();
          }}
          className="btn-primary mt-6 w-full py-3"
        >
          Ir a iniciar sesión
        </button>
      </Modal>

      {/* Checkout modal */}
      <Modal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title="Finalizar pedido"
        size="sm"
      >
        {orderPlaced ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-stone-100">
              ¡Pedido enviado!
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Te redirigimos a WhatsApp para confirmar tu orden. También lo
              guardamos en tu historial de pedidos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-4">
            <p className="text-sm text-stone-400">
              Completa tus datos y te llevaremos a WhatsApp para confirmar el pedido
              con el equipo de Fimpollo. Tu pedido quedará guardado en tu cuenta.
            </p>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-300">
                Nombre
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tu nombre o el del negocio"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-300">
                Teléfono
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="300 123 4567"
                className="input-field"
              />
            </div>
            <div className="rounded-lg bg-neutral-800 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Total del pedido</span>
                <span className="font-bold text-brand-400">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            {saveError && (
              <div className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {saveError}
              </div>
            )}
            <button type="submit" disabled={saving} className="btn-primary w-full py-3">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando pedido...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Enviar por WhatsApp
                </>
              )}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
