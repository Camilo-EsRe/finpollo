import { useEffect, useState } from 'react';
import {
  Search,
  Clock,
  CheckCircle2,
  Package,
  ChevronDown,
  ChevronUp,
  Phone,
  User,
  Loader2,
  Inbox,
} from 'lucide-react';
import { supabase, type OrderWithItems } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';

type StatusFilter = 'todos' | 'pendiente' | 'aceptado';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; badge: string }> = {
  pendiente: {
    label: 'Pendiente',
    icon: <Clock className="h-3.5 w-3.5" />,
    badge: 'bg-amber-500/15 text-amber-300',
  },
  aceptado: {
    label: 'Aceptado',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    badge: 'bg-green-500/15 text-green-300',
  },
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setOrders(data as unknown as OrderWithItems[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingId(null);
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

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'todos' || o.status === statusFilter;
    const matchesSearch =
      search.trim() === '' ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = orders.filter((o) => o.status === 'pendiente').length;
  const acceptedCount = orders.filter((o) => o.status === 'aceptado').length;

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-neutral-800 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          <FilterButton
            active={statusFilter === 'todos'}
            onClick={() => setStatusFilter('todos')}
            label="Todos"
            count={orders.length}
          />
          <FilterButton
            active={statusFilter === 'pendiente'}
            onClick={() => setStatusFilter('pendiente')}
            label="Pendientes"
            count={pendingCount}
          />
          <FilterButton
            active={statusFilter === 'aceptado'}
            onClick={() => setStatusFilter('aceptado')}
            label="Aceptados"
            count={acceptedCount}
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
          <p className="mt-3 text-sm text-stone-500">Cargando pedidos...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800">
            <Inbox className="h-6 w-6 text-stone-500" />
          </div>
          <h3 className="mt-3 font-display text-base font-bold text-stone-300">
            {orders.length === 0 ? 'No hay pedidos aún' : 'No hay pedidos con este filtro'}
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            {orders.length === 0
              ? 'Cuando los clientes hagan pedidos, aparecerán aquí.'
              : 'Prueba con otro filtro o búsqueda.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-800/50 text-left text-xs uppercase tracking-wider text-stone-500">
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Teléfono</th>
                  <th className="px-4 py-3 font-semibold">Productos</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filtered.map((order) => {
                  const itemCount = order.order_items.reduce((s, i) => s + i.quantity, 0);
                  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pendiente;
                  const isExpanded = expandedId === order.id;
                  return (
                    <>
                      <tr key={order.id} className="transition-colors hover:bg-neutral-800/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15">
                              <User className="h-4 w-4 text-brand-400" />
                            </div>
                            <span className="font-semibold text-stone-100">{order.customer_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-stone-400">{order.customer_phone}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : order.id)}
                            className="inline-flex items-center gap-1.5 text-stone-300 transition-colors hover:text-brand-400"
                          >
                            <Package className="h-4 w-4 text-stone-500" />
                            {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 font-semibold text-brand-400">
                          {formatPrice(Number(order.total))}
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${cfg.badge}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {order.status === 'pendiente' ? (
                              <button
                                onClick={() => updateStatus(order.id, 'aceptado')}
                                disabled={updatingId === order.id}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-green-500 active:scale-[0.98] disabled:opacity-50"
                              >
                                {updatingId === order.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                )}
                                Aceptar
                              </button>
                            ) : (
                              <button
                                onClick={() => updateStatus(order.id, 'pendiente')}
                                disabled={updatingId === order.id}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-stone-300 transition-all hover:bg-neutral-700 active:scale-[0.98] disabled:opacity-50"
                              >
                                {updatingId === order.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Clock className="h-3.5 w-3.5" />
                                )}
                                Revertir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={order.id + '-items'} className="bg-neutral-800/30">
                          <td colSpan={7} className="px-4 py-3">
                            <div className="space-y-2">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  {item.product_image ? (
                                    <img
                                      src={item.product_image}
                                      alt={item.product_name}
                                      className="h-10 w-10 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-700">
                                      <Package className="h-5 w-5 text-stone-500" />
                                    </div>
                                  )}
                                  <span className="flex-1 text-sm text-stone-200">
                                    {item.product_name}
                                  </span>
                                  <span className="text-xs text-stone-500">{item.quantity}x</span>
                                  <span className="text-sm font-semibold text-stone-400">
                                    {formatPrice(Number(item.product_price) * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-neutral-800 lg:hidden">
            {filtered.map((order) => {
              const itemCount = order.order_items.reduce((s, i) => s + i.quantity, 0);
              const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pendiente;
              const isExpanded = expandedId === order.id;
              return (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-100">{order.customer_name}</h4>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                        <Phone className="h-3 w-3" />
                        {order.customer_phone}
                      </div>
                    </div>
                    <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-stone-400 transition-colors hover:text-brand-400"
                    >
                      <Package className="h-3.5 w-3.5" />
                      {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    <span className="text-sm font-bold text-brand-400">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-stone-500">{formatDate(order.created_at)}</div>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 rounded-lg bg-neutral-800/50 p-3">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="h-8 w-8 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-700">
                              <Package className="h-4 w-4 text-stone-500" />
                            </div>
                          )}
                          <span className="flex-1 text-xs text-stone-200">{item.product_name}</span>
                          <span className="text-xs text-stone-500">{item.quantity}x</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3">
                    {order.status === 'pendiente' ? (
                      <button
                        onClick={() => updateStatus(order.id, 'aceptado')}
                        disabled={updatingId === order.id}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-green-500 active:scale-[0.98] disabled:opacity-50"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Aceptar pedido
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(order.id, 'pendiente')}
                        disabled={updatingId === order.id}
                        className="btn-secondary w-full text-xs"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Clock className="h-3.5 w-3.5" />
                        )}
                        Marcar como pendiente
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all active:scale-95 ${
        active
          ? 'bg-brand-500 text-neutral-950'
          : 'border border-neutral-700 bg-neutral-900 text-stone-400 hover:border-brand-600 hover:text-brand-400'
      }`}
    >
      {label}
      <span
        className={`flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
          active ? 'bg-neutral-950/20 text-neutral-950' : 'bg-neutral-800 text-stone-500'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
