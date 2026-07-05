import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for local bypass
    const isBypass = localStorage.getItem('admin_bypass') === 'true';
    if (isBypass) {
      setUser({ email: 'thiru@portfolio.local', displayName: 'Thiru (Admin)' });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem('admin_bypass', 'true');
    setUser({ email: 'thiru@portfolio.local', displayName: 'Thiru (Admin)' });
  };

  const logout = () => {
    localStorage.removeItem('admin_bypass');
    setUser(null);
  };

  return { user, loading, login, logout };
}
