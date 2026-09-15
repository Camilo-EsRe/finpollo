import { useEffect, useMemo, useState } from 'react';
import {
  Package,
  Boxes,
  TrendingUp,
  AlertCircle,
  Store,
  LogOut,
  ClipboardList,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/utils';
import { supabase } from '../lib/supabase';
import ProductTable from '../components/admin/ProductTable';
import OrdersTable from '../components/admin/OrdersTable';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToStore: () => void;
}

type Tab = 'productos' | 'pedidos';

export default function AdminDashboard({ onLogout, onBackToStore }: AdminDashboardProps) {
  const { products } = useStore();
  const [tab, setTab] = useState<Tab>('productos');
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, accepted: 0, revenue: 0 });

  const productStats = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStock = products.filter((p) => p.stock < 50).length;
    return {
      totalProducts: products.length,
      totalValue,
      lowStock,
      categories: new Set(products.map((p) => p.category)).size,
    };
  }, [products]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('total, status');
      if (error || cancelled || !data) return;
      const pending = data.filter((o) => o.status === 'pendiente').length;
      const accepted = data.filter((o) => o.status === 'aceptado').length;
      const revenue = data
        .filter((o) => o.status === 'aceptado')
        .reduce((sum, o) => sum + Number(o.total), 0);
      setOrderStats({ total: data.length, pending, accepted, revenue });
    })();
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const productCards = [
    {
      label: 'Total productos',
      value: productStats.totalProducts.toString(),
      icon: <Package className="h-5 w-5" />,
      color: 'bg-brand-500/15 text-brand-400',
    },
    {
      label: 'Valor inventario',
      value: formatPrice(productStats.totalValue),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-ocean-700/40 text-stone-300',
    },
    {
      label: 'Categorías',
      value: productStats.categories.toString(),
      icon: <Boxes className="h-5 w-5" />,
      color: 'bg-amber-500/15 text-amber-300',
    },
    {
      label: 'Stock bajo',
      value: productStats.lowStock.toString(),
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'bg-red-500/15 text-red-400',
    },
  ];

  const orderCards = [
    {
      label: 'Pedidos totales',
      value: orderStats.total.toString(),
      icon: <ClipboardList className="h-5 w-5" />,
      color: 'bg-brand-500/15 text-brand-400',
    },
    {
      label: 'Pendientes',
      value: orderStats.pending.toString(),
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-amber-500/15 text-amber-300',
    },
    {
      label: 'Aceptados',
      value: orderStats.accepted.toString(),
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'bg-green-500/15 text-green-300',
    },
    {
      label: 'Ingresos aceptados',
      value: formatPrice(orderStats.revenue),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-brand-500/15 text-brand-400',
    },
  ];

  const statCards = tab === 'productos' ? productCards : orderCards;

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <h1 className="font-display text-lg font-extrabold text-stone-100">
              Panel Administrador
            </h1>
            <p className="text-xs text-stone-500">Distribuidora Fimpollo — Gestión de inventario y pedidos</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onBackToStore} className="btn-ghost">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Ver tienda</span>
            </button>
            <button onClick={onLogout} className="btn-secondary">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-neutral-800">
          <TabButton
            active={tab === 'productos'}
            onClick={() => setTab('productos')}
            icon={<Package className="h-4 w-4" />}
            label="Productos"
          />
          <TabButton
            active={tab === 'pedidos'}
            onClick={() => setTab('pedidos')}
            icon={<ClipboardList className="h-4 w-4" />}
            label="Pedidos"
            badge={orderStats.pending > 0 ? orderStats.pending : undefined}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="mt-3 font-display text-2xl font-extrabold text-stone-100">
                {stat.value}
              </div>
              <div className="text-xs font-medium text-stone-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="mt-8">
          {tab === 'productos' ? (
            <>
              <h2 className="mb-4 font-display text-xl font-bold text-stone-100">
                Gestión de productos
              </h2>
              <ProductTable />
            </>
          ) : (
            <>
              <h2 className="mb-4 font-display text-xl font-bold text-stone-100">
                Gestión de pedidos
              </h2>
              <OrdersTable />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? 'text-brand-400'
          : 'text-stone-500 hover:text-stone-300'
      }`}
    >
      {icon}
      {label}
      {badge !== undefined && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-[11px] font-bold text-amber-300">
          {badge}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-400" />
      )}
    </button>
  );
}
