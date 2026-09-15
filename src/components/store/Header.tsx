import { Menu, Search, ShoppingCart, User, LogOut, History, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNavigateAdmin: () => void;
  onLogoClick: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onAuthClick: () => void;
  onOrderHistoryClick: () => void;
}

export default function Header({
  cartCount,
  onCartClick,
  searchQuery,
  onSearchChange,
  onNavigateAdmin,
  onLogoClick,
  mobileMenuOpen,
  onToggleMobileMenu,
  onAuthClick,
  onOrderHistoryClick,
}: HeaderProps) {
  const { user, signOut } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!user) {
      setOrderCount(0);
      return;
    }
    let cancelled = false;
    (async () => {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (!error && !cancelled && count !== null) {
        setOrderCount(count);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const emailPrefix = user?.email?.split('@')[0] ?? '';

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={onLogoClick}
          className="flex-shrink-0 transition-opacity hover:opacity-80"
          aria-label="Inicio"
        >
          <Logo />
        </button>

        {/* Search - desktop */}
        <div className="relative ml-2 hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Account / Login */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setAccountMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg p-2.5 text-stone-200 transition-colors hover:bg-neutral-800"
                aria-label="Mi cuenta"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-300">
                  {emailPrefix.charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[100px] truncate text-sm font-medium sm:inline">
                  {emailPrefix}
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-stone-500 sm:inline" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 animate-scale-in rounded-xl border border-neutral-800 bg-neutral-900 py-2 shadow-xl">
                  <div className="px-4 py-2 border-b border-neutral-800">
                    <div className="text-xs text-stone-500">Conectado como</div>
                    <div className="truncate text-sm font-semibold text-stone-200">
                      {user.email}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onOrderHistoryClick();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-stone-300 transition-colors hover:bg-neutral-800"
                  >
                    <History className="h-4 w-4 text-stone-500" />
                    <span className="flex-1 text-left">Mis pedidos</span>
                    {orderCount > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-neutral-950">
                        {orderCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-400 transition-colors hover:bg-brand-500/10"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Ingresar</span>
            </button>
          )}

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative inline-flex items-center justify-center rounded-lg p-2.5 text-stone-200 transition-colors hover:bg-neutral-800"
            aria-label="Carrito de compras"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-neutral-950">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleMobileMenu}
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-stone-200 transition-colors hover:bg-neutral-800 md:hidden"
            aria-label="Menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search - mobile */}
      <div className="border-t border-neutral-800 px-4 py-2.5 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-800 bg-neutral-950 px-4 py-3 md:hidden">
          {user ? (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onOrderHistoryClick();
                  onToggleMobileMenu();
                }}
                className="btn-secondary w-full justify-between"
              >
                <span className="inline-flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Mis pedidos
                </span>
                {orderCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-neutral-950">
                    {orderCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  signOut();
                  onToggleMobileMenu();
                }}
                className="btn-secondary w-full text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onAuthClick();
                onToggleMobileMenu();
              }}
              className="btn-primary w-full"
            >
              <User className="h-4 w-4" />
              Ingresar / Registrarse
            </button>
          )}
          <div className="mt-2 pt-2 border-t border-neutral-800">
            <button
              onClick={() => {
                onNavigateAdmin();
                onToggleMobileMenu();
              }}
              className="btn-secondary w-full"
            >
              Panel Administrador
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
