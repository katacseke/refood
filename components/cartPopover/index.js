import { useContext } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PopoverHeader, PopoverBody, ModalFooter } from 'shards-react';
import CartContext from '../../context/cartContext';
import QuantityChanger from '../quantityChanger';
import styles from './cartPopover.module.scss';

const CartPopover = () => {
  const { cart, updateCartItem } = useContext(CartContext);

  const handleUpdate = async (mealId, newQuantity) => {
    try {
      await updateCartItem({ meal: mealId, quantity: newQuantity });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });

  const totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.meal.price, 0);

  const renderCartItem = (item) => (
    <div key={item.meal.id}>
      <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
        <p className={styles.mealName}>{item.meal.name}</p>

        <p className="pl-5 mb-1">{currencyFormatter.format(item.meal.price * item.quantity)}</p>
      </div>
      <QuantityChanger
        quantity={item.quantity}
        onAdd={() => handleUpdate(item.meal.id, item.quantity + 1)}
        onSubtract={() => handleUpdate(item.meal.id, item.quantity - 1)}
        max={item.meal.portionNumber}
      />
      <hr />
    </div>
  );

  return (
    <>
      <PopoverHeader>
        {cart.restaurant ? (
          <Link href={`/restaurants/${cart.restaurant.id}`}>
            <a>{cart.restaurant.name}</a>
          </Link>
        ) : (
          'Kosár'
        )}
      </PopoverHeader>

      <PopoverBody className={styles.popoverBody}>
        {cart.items.length > 0 ? (
          <>
            {cart.items.map(renderCartItem)}
            <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
              <p className={styles.mealName}>Összesen</p>

              <p className="pl-5 mb-1 font-weight-bold">{currencyFormatter.format(totalPrice)}</p>
            </div>
          </>
        ) : (
          <p className="text-center mb-0">A kosár üres.</p>
        )}
      </PopoverBody>
      <ModalFooter className="p-2 pr-3 font-weight-bold">
        <Link href="/cart">
          <a>Tovább a kosárhoz...</a>
        </Link>
      </ModalFooter>
    </>
  );
};

export default CartPopover;
