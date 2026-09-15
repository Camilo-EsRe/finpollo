import { useMemo, useState } from 'react';
import type { Category } from '../types';
import { useStore } from '../context/StoreContext';
import Header from '../components/store/Header';
import Hero from '../components/store/Hero';
import ProductGrid from '../components/store/ProductGrid';
import CartDrawer from '../components/store/CartDrawer';
import Footer from '../components/store/Footer';
import AuthModal from '../components/store/AuthModal';
import OrderHistoryModal from '../components/store/OrderHistoryModal';
import { ToastContainer } from '../components/ui/Toast';

interface StoreViewProps {
  onNavigateAdmin: () => void;
}

export default function StoreView({ onNavigateAdmin }: StoreViewProps) {
  const { products, cartCount, toasts, dismissToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateAdmin={onNavigateAdmin}
        onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)}
        onAuthClick={() => setAuthOpen(true)}
        onOrderHistoryClick={() => setOrderHistoryOpen(true)}
      />

      <Hero onShopNow={scrollToCatalog} />

      <ProductGrid
        products={filteredProducts}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <Footer onNavigateAdmin={onNavigateAdmin} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <OrderHistoryModal
        open={orderHistoryOpen}
        onClose={() => setOrderHistoryOpen(false)}
        onOpenCart={() => setCartOpen(true)}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
