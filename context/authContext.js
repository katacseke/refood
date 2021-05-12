import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useInterval from 'use-interval';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    await axios.post('/api/users/logout');

    setUser(null);
  };

  const login = async (data) => {
    const res = await axios.post('/api/users/login', data);

    setUser(res.data);
  };

  const registration = async (data) => {
    const res = await axios.post('/api/users', data);

    setUser(res.data);
  };

  const refreshToken = async (strict = true) => {
    if (strict && !user) {
      return;
    }

    try {
      const res = await axios.post('/api/users/refreshToken');
      setUser(res.data);

      // eslint-disable-next-line no-empty
    } catch (err) {}
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
