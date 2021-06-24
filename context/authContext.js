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

    return res;
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
    } catch (err) {}
  };

  useEffect(() => refreshToken(false), []);
  useInterval(refreshToken, 30 * 60 * 1000);

  return (
    <AuthContext.Provider value={{ user, login, logout, registration, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
