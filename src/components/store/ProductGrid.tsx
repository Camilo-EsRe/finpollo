import { PackageSearch } from 'lucide-react';
import type { Category } from '../../types';
import { CATEGORIES } from '../../types';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  activeCategory: Category | 'Todos';
  onCategoryChange: (cat: Category | 'Todos') => void;
}

const FILTERS: (Category | 'Todos')[] = ['Todos', ...CATEGORIES];

export default function ProductGrid({
  products,
  activeCategory,
  onCategoryChange,
}: ProductGridProps) {
  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-stone-100 sm:text-3xl">
            Catálogo de productos
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => onCategoryChange(filter)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              activeCategory === filter
                ? 'bg-brand-500 text-neutral-950 shadow-md shadow-brand-500/20'
                : 'border border-neutral-700 bg-neutral-900 text-stone-400 hover:border-brand-600 hover:text-brand-400'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
            <PackageSearch className="h-7 w-7 text-stone-500" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-stone-300">
            No se encontraron productos
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Prueba con otra búsqueda o categoría.
          </p>
        </div>
      )}
    </section>
  );
}
