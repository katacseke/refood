import React, { useEffect, useState, useContext } from 'react';
import AuthContext from './authContext';

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const updateCartItem = async (cartItem) => {
    const res = await fetch(`/api/users/${user.id}/cart`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItem),
    });

    if (res.ok) {
      setCart(await res.json());
      return;
    }

    const err = await res.json();
    throw new Error(err);
  };

  const addCartItem = async (cartItem) => {
    const res = await fetch(`/api/users/${user.id}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItem),
    });

    if (res.ok) {
      setCart(await res.json());
      return;
    }

    const err = await res.json();
    throw new Error(err);
  };

  const deleteCartContent = async () => {
    const res = await fetch(`/api/users/${user.id}/cart`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setCart(await res.json());
      return;
    }

    const err = await res.json();
    throw new Error(err);
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

  return (
    <CartContext.Provider value={{ cart, updateCartItem, addCartItem, deleteCartContent }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
