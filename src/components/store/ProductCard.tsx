import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../../types';
import { categoryColors, formatPrice } from '../../lib/utils';
import { useStore } from '../../context/StoreContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group card flex flex-col overflow-hidden transition-all hover:shadow-lg hover:border-brand-700/50 hover:-translate-y-0.5">
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className={`badge absolute left-3 top-3 ${categoryColors(product.category)}`}>
          {product.category}
        </span>
        {product.stock < 50 && (
          <span className="badge absolute right-3 top-3 bg-amber-500/20 text-amber-300">
            Stock bajo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-sm font-bold leading-snug text-stone-100 line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 text-xs text-stone-500 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <div className="font-display text-lg font-extrabold text-brand-400">
              {formatPrice(product.price)}
            </div>
            <div className="text-[11px] text-stone-500">Stock: {product.stock} und.</div>
          </div>
          <button
            onClick={handleAdd}
            className={`inline-flex items-center justify-center rounded-lg p-2.5 transition-all active:scale-90 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-brand-500 text-neutral-950 hover:bg-brand-400'
            }`}
            aria-label={added ? 'Agregado' : 'Agregar al carrito'}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
