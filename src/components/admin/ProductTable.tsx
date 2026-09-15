import { useState } from 'react';
import { Pencil, Trash2, Plus, Search, AlertTriangle } from 'lucide-react';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { categoryColors, formatPrice } from '../../lib/utils';
import Modal from '../ui/Modal';
import ProductFormModal from './ProductFormModal';

export default function ProductTable() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Omit<Product, 'id'> | Product) => {
    if ('id' in data) {
      updateProduct(data);
    } else {
      addProduct(data);
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-neutral-800 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Agregar producto
        </button>
      </div>

      {/* Table — desktop */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-800/50 text-left text-xs uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filtered.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-neutral-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-semibold text-stone-100">{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-stone-500 line-clamp-1">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${categoryColors(product.category)}`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-stone-100">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-medium ${
                      product.stock < 50 ? 'text-amber-400' : 'text-stone-300'
                    }`}
                  >
                    {product.stock} und.
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditing(product);
                        setFormOpen(true);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-brand-500/15 hover:text-brand-400"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState />}
      </div>

      {/* Cards — mobile */}
      <div className="divide-y divide-neutral-800 lg:hidden">
        {filtered.map((product) => (
          <div key={product.id} className="flex gap-3 p-4">
            <img
              src={product.image}
              alt={product.name}
              className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-stone-100">{product.name}</h4>
                  <span className={`badge mt-1 ${categoryColors(product.category)}`}>
                    {product.category}
                  </span>
                </div>
                <div className="text-sm font-bold text-brand-400">
                  {formatPrice(product.price)}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-xs text-stone-500">Stock: {product.stock} und.</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditing(product);
                      setFormOpen(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-brand-500/15 hover:text-brand-400"
                    aria-label="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState />}
      </div>

      {/* Form modal */}
      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        editingProduct={editing}
      />

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar producto"
        size="sm"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <p className="mt-4 text-sm text-stone-300">
            ¿Seguro que deseas eliminar{' '}
            <span className="font-semibold text-stone-100">{deleteTarget?.name}</span>? Esta acción no se
            puede deshacer.
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-500 active:scale-[0.98]"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800">
        <Search className="h-6 w-6 text-stone-500" />
      </div>
      <h3 className="mt-3 font-display text-base font-bold text-stone-300">
        No hay productos
      </h3>
      <p className="mt-1 text-sm text-stone-500">
        Agrega un nuevo producto o ajusta tu búsqueda.
      </p>
    </div>
  );
}
