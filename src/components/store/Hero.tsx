import { ArrowRight, Truck, PackageCheck, Headphones } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-ocean-950 text-white">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/15 blur-2xl" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-brand-700/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-4 py-1.5 text-sm font-medium text-brand-300 backdrop-blur-sm ring-1 ring-brand-500/20">
              <PackageCheck className="h-4 w-4" />
              Insumos para tu negocio
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Todo lo que tu negocio de papas fritas necesita
            </h1>
            <p className="mt-5 max-w-lg text-lg text-stone-400">
              Empaques, servilletas, salsas, implementos de aseo y más. Calidad
              distribuida al por mayor con envíos a toda la ciudad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onShopNow} className="btn-primary">
                Ver catálogo
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Feature icon={<Truck className="h-5 w-5" />} text="Envíos rápidos" />
              <Feature icon={<PackageCheck className="h-5 w-5" />} text="Stock disponible" />
              <Feature icon={<Headphones className="h-5 w-5" />} text="Atención B2B" />
            </div>
          </div>

          {/* Hero image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-brand-500/20">
                <img
                  src="https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Papas fritas doradas con salsas"
                  className="h-[420px] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 rounded-xl bg-neutral-900 p-4 shadow-xl ring-1 ring-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/15">
                    <PackageCheck className="h-5 w-5 text-brand-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-brand-400">+160</div>
                    <div className="text-xs text-stone-500">productos disponibles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-stone-400">
      <span className="text-brand-400">{icon}</span>
      {text}
    </div>
  );
}
