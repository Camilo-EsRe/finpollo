import Logo from '../ui/Logo';
import { Facebook, Instagram, Phone, Mail, MapPin, Settings } from 'lucide-react';

interface FooterProps {
  onNavigateAdmin: () => void;
}

export default function Footer({ onNavigateAdmin }: FooterProps) {
  return (
    <footer className="border-t border-neutral-800 bg-black text-stone-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm text-stone-500">
              Distribuidora de insumos para negocios de papas fritas y demás.
              Empaques, salsas, aseo y más, al por mayor.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 transition-colors hover:bg-brand-500/15" aria-label="Facebook">
                <Facebook className="h-4 w-4 text-brand-400" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 transition-colors hover:bg-brand-500/15" aria-label="Instagram">
                <Instagram className="h-4 w-4 text-brand-400" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-stone-200">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-400" />
                +57 300 123 4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-400" />
                ventas@fimpollo.co
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-400" />
                Bodega central — Caldas, Antioquia
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-stone-200">
              Empresa
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#catalogo" className="transition-colors hover:text-brand-400">Catálogo</a></li>
              <li><a href="#" className="transition-colors hover:text-brand-400">Horarios de atención</a></li>
              <li>
                <button
                  onClick={onNavigateAdmin}
                  className="inline-flex items-center gap-1.5 rounded text-stone-500 transition-colors hover:text-brand-400"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Panel administrador
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs text-stone-600">
          &copy; {new Date().getFullYear()} Distribuidora Fimpollo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
