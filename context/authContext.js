import React, { useEffect, useState } from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    const res = await fetch('/api/users/logout', {
      method: 'POST',
    });

    if (res.ok) {
      setUser(null);
    }
  };

  const refreshToken = async () => {
    console.log('Refreshing token');
    const res = await fetch('/api/users/refreshToken', {
      method: 'POST',
    });

    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
    }
  };

  useEffect(() => {
    refreshToken();

    const interval = setInterval(refreshToken, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
