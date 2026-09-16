import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Category, Product } from '../../types';
import { CATEGORIES } from '../../types';
import Modal from '../ui/Modal';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> | Product) => Promise<void>;
  editingProduct: Product | null;
}

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/15801054/pexels-photo-15801054.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const emptyForm: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  category: 'Empaques',
  image: DEFAULT_IMAGE,
  description: '',
  stock: 0,
};

export default function ProductFormModal({
  open,
  onClose,
  onSave,
  editingProduct,
}: ProductFormModalProps) {
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      const { id: _id, ...rest } = editingProduct;
      void _id;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [editingProduct, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const cleaned: Omit<Product, 'id'> = {
      ...form,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      image: form.image.trim() || DEFAULT_IMAGE,
    };
    try {
      await onSave(editingProduct ? { ...cleaned, id: editingProduct.id } : cleaned);
      onClose();
    } catch {
      // error handled by parent
    }
    setSaving(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingProduct ? 'Editar producto' : 'Agregar producto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-stone-300">
              Nombre del producto
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="Ej. Empaque de cartón 1/2 libra"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-300">
              Precio (COP)
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="input-field"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-300">
              Stock
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.stock || ''}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              className="input-field"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-300">
              Categoría
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="input-field"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-stone-300">
              URL de imagen
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="input-field"
              placeholder="https://..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-stone-300">
              Descripción (opcional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input-field resize-none"
              placeholder="Breve descripción del producto..."
            />
          </div>
        </div>

        {/* Image preview */}
        <div className="flex items-center gap-3 rounded-lg bg-neutral-800 p-3">
          <img
            src={form.image || DEFAULT_IMAGE}
            alt="Vista previa"
            className="h-14 w-14 rounded-lg object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
            }}
          />
          <span className="text-xs text-stone-500">Vista previa de la imagen</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingProduct ? 'Guardar cambios' : 'Agregar producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
