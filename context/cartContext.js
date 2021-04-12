import React, { useEffect, useState, useContext } from 'react';
import AuthContext from './authContext';

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const updateCart = async (newCart) => {
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart: newCart }),
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

    const res = await fetch(`/api/users/${user.id}`);

    if (res.ok) {
      const userResponse = await res.json;
      setCart(userResponse.cart);
    }
  }, [user]);

  return <CartContext.Provider value={{ cart, updateCart }}>{children}</CartContext.Provider>;
};

export default CartContext;
