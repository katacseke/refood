import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import AuthContext from './authContext';

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });

  const updateCartItem = async (cartItem) => {
    const res = await axios.patch(`/api/users/${user.id}/cart`, cartItem);
    setCart(res.data);
  };

  const addCartItem = async (cartItem) => {
    const res = await axios.post(`/api/users/${user.id}/cart`, cartItem);
    setCart(await res.data);
  };

  const deleteCartContent = async () => {
    await axios.delete(`/api/users/${user.id}/cart`);
    setCart({ items: [] });
  };

  const refresh = async () => {
    if (!user) {
      return;
    }

    const res = await axios.get(`/api/users/${user.id}/cart`);

    setCart(res.data);
  };

  useEffect(refresh, [user]); // refresh cart content when user logs in or out

  return (
    <CartContext.Provider value={{ cart, updateCartItem, addCartItem, deleteCartContent, refresh }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
