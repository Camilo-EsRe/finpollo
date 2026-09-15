import { useState } from 'react';
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import Logo from '../ui/Logo';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'administracionfp@fimpollo.co' && password === 'AdministradorFimPollo2026*') {
      setError('');
      onLogin();
    } else {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-700/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </button>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo size={48} showText={false} />
            <h1 className="mt-4 font-display text-2xl font-extrabold text-stone-100">
              Panel Administrador
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Inicia sesión para gestionar el inventario
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-300">
                Correo
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Correo electrónico"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-300">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3">
              <ShieldCheck className="h-4 w-4" />
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
