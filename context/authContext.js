import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import useInterval from 'use-interval';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    const res = await fetch('/api/users/logout', {
      method: 'POST',
    });

    if (res.ok) {
      setUser(null);
      Router.push('/');
    }
  };

  const login = async (data) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setUser(await res.json());
    }

    return res;
  };

  const registration = async (data) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setUser(await res.json());
    }

    return res;
  };

  const refreshToken = async (strict = true) => {
    if (strict && !user) {
      return;
    }

    const res = await fetch('/api/users/refreshToken', {
      method: 'POST',
    });

    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
    }
  };

  useEffect(() => refreshToken(false), []);
  useInterval(refreshToken, 30 * 60 * 1000);

  return (
    <AuthContext.Provider value={{ user, login, logout, registration }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
