import { useState } from 'react';
import { Mail, Lock, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import Logo from '../ui/Logo';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail('');
    setPassword('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    reset();
    onClose();
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
  };

  return (
    <Modal open={open} onClose={handleClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <Logo size={44} showText={false} />
        <h2 className="mt-4 font-display text-xl font-extrabold text-stone-100">
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          {mode === 'login'
            ? 'Accede para ver tu historial de pedidos'
            : 'Regístrate para guardar tus pedidos y repetirlos fácilmente'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-300">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="tu@correo.com"
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
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? (
            'Procesando...'
          ) : (
            <>
              {mode === 'login' ? (
                <>
                  <User className="h-4 w-4" />
                  Ingresar
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Crear cuenta
                </>
              )}
            </>
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-stone-500">
        {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <button
          onClick={switchMode}
          className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
        >
          {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </div>
    </Modal>
  );
}
