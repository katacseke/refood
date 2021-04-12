import React, { useEffect, useState, useContext } from 'react';
import AuthContext from './authContext';

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const updateCart = async (newCart) => {
    const res = await fetch(`/api/users/${user.id}/cart`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCart),
    });

    if (res.ok) {
      setCart(newCart);
      return;
    }

    throw new Error('A kosár frissítése sikertelen');
  };

  useEffect(async () => {
    if (!user) {
      return;
    }

    const res = await fetch(`/api/users/${user.id}/cart`);

    if (res.ok) {
      setCart(await res.json());
    }
  }, [user]);

  return <CartContext.Provider value={{ cart, updateCart }}>{children}</CartContext.Provider>;
};

export default CartContext;
