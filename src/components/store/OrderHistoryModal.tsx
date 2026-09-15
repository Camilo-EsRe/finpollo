import { useEffect, useState } from 'react';
import {
  History,
  RotateCcw,
  Package,
  Calendar,
  Loader2,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { supabase, type OrderWithItems } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';
import Modal from '../ui/Modal';

interface OrderHistoryModalProps {
  open: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export default function OrderHistoryModal({ open, onClose, onOpenCart }: OrderHistoryModalProps) {
  const { user } = useAuth();
  const { addToCart, products, showToast } = useStore();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as unknown as OrderWithItems[]);
      }
      setLoading(false);
    })();
  }, [open, user]);

  const handleReorder = (order: OrderWithItems) => {
    setReorderedId(order.id);
    order.order_items.forEach((item) => {
      const match = products.find((p) => p.name === item.product_name);
      if (match) {
        for (let i = 0; i < item.quantity; i++) {
          addToCart(match);
        }
      }
    });
    setTimeout(() => {
      setReorderedId(null);
      onClose();
      showToast(
        'El pedido ya se añadió al carrito, para que lo modifiques o lo confirmes.',
        'Ver carrito',
        onOpenCart
      );
    }, 1200);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalItems = orders.reduce(
    (sum, o) => sum + o.order_items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  return (
    <Modal open={open} onClose={onClose} title="Mis pedidos" size="lg">
      {loading ? (
        <div className="flex flex-col items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
          <p className="mt-3 text-sm text-stone-500">Cargando tus pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
            <History className="h-7 w-7 text-stone-500" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-stone-300">
            Aún no tienes pedidos
          </h3>
          <p className="mt-1 max-w-xs text-sm text-stone-500">
            Cuando hagas tu primer pedido, aparecerá aquí para que puedas repetirlo
            fácilmente sin volver a elegir todo desde cero.
          </p>
          <button
            onClick={onClose}
            className="btn-primary mt-5"
          >
            <ShoppingBag className="h-4 w-4" />
            Explorar catálogo
          </button>
        </div>
      ) : (
        <>
          {/* Summary bar */}
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-800/50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15">
                <Package className="h-5 w-5 text-brand-400" />
              </div>
              <div>
                <div className="font-display text-xl font-extrabold text-stone-100">
                  {orders.length}
                </div>
                <div className="text-xs text-stone-500">
                  {orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
                </div>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-800/50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15">
                <ShoppingBag className="h-5 w-5 text-brand-400" />
              </div>
              <div>
                <div className="font-display text-xl font-extrabold text-stone-100">
                  {totalItems}
                </div>
                <div className="text-xs text-stone-500">
                  {totalItems === 1 ? 'producto en total' : 'productos en total'}
                </div>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-800/50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15">
                <History className="h-5 w-5 text-brand-400" />
              </div>
              <div>
                <div className="font-display text-xl font-extrabold text-brand-400">
                  {formatPrice(totalSpent)}
                </div>
                <div className="text-xs text-stone-500">total comprado</div>
              </div>
            </div>
          </div>

          {/* Orders list */}
          <div className="space-y-4">
            {orders.map((order, index) => {
              const itemCount = order.order_items.reduce((s, i) => s + i.quantity, 0);
              const orderNumber = orders.length - index;
              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-neutral-800 overflow-hidden"
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-800/50 px-4 py-3">
                    <div className="flex items-center gap-2.5 text-sm">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-500/15 font-display text-xs font-bold text-brand-300">
                        #{orderNumber}
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-stone-500" />
                          <span className="font-medium text-stone-300">
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 mt-0.5">
                          {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-display text-lg font-extrabold text-brand-400">
                        {formatPrice(Number(order.total))}
                      </span>
                      <span className="badge bg-brand-500/15 text-brand-300 mt-0.5">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="divide-y divide-neutral-800">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800">
                            <Package className="h-5 w-5 text-stone-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-medium text-stone-200">
                            {item.product_name}
                          </span>
                          <span className="ml-2 text-xs text-stone-500">
                            {item.quantity}x
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-stone-400">
                          {formatPrice(Number(item.product_price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Reorder button */}
                  <div className="border-t border-neutral-800 px-4 py-3">
                    <button
                      onClick={() => handleReorder(order)}
                      disabled={reorderedId === order.id}
                      className="btn-primary w-full"
                    >
                      {reorderedId === order.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Productos agregados al carrito
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4" />
                          Volver a pedir esto
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Modal>
  );
}
