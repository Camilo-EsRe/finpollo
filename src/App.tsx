import { useEffect, useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import StoreView from './views/StoreView';
import AdminView from './views/AdminView';
import AdminLogin from './components/admin/AdminLogin';

type Route = 'store' | 'admin-login' | 'admin-dashboard';

function parseHash(): Route {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash === '/admin') return 'admin-login';
  if (hash === '/admin/dashboard') return 'admin-dashboard';
  return 'store';
}

function setHash(route: Route) {
  const map: Record<Route, string> = {
    store: '',
    'admin-login': '/admin',
    'admin-dashboard': '/admin/dashboard',
  };
  window.location.hash = map[route];
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (r: Route) => {
    setHash(r);
    setRoute(r);
    window.scrollTo({ top: 0 });
  };

  return (
    <AuthProvider>
      <StoreProvider>
        {route === 'store' && (
          <StoreView onNavigateAdmin={() => navigate('admin-login')} />
        )}
        {route === 'admin-login' && (
          <AdminLogin
            onLogin={() => navigate('admin-dashboard')}
            onBack={() => navigate('store')}
          />
        )}
        {route === 'admin-dashboard' && (
          <AdminView
            onLogout={() => navigate('admin-login')}
            onBackToStore={() => navigate('store')}
          />
        )}
      </StoreProvider>
    </AuthProvider>
  );
}
