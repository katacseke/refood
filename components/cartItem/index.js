import { Button } from 'shards-react';
import { IoClose } from 'react-icons/io5';

import QuantityChanger from '@components/quantityChanger';
import styles from './cartItem.module.scss';

const CartItem = ({ item, showRemoveButton, showQuantityChanger, onQuantityUpdate }) => {
  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });
  return (
    <div>
      <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
        <p className={styles.mealName}>{item.meal.name}</p>

        <p className="pl-2 mb-1 text-right">
          {item.quantity} x {currencyFormatter.format(item.meal.price)}
        </p>
      </div>
      <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
        {showQuantityChanger && (
          <QuantityChanger
            quantity={item.quantity}
            onAdd={() => onQuantityUpdate(item.meal.id, item.quantity + 1)}
            onSubtract={() => onQuantityUpdate(item.meal.id, item.quantity - 1)}
            max={item.meal.portionNumber}
          />
        )}

        {showRemoveButton && (
          <Button
            theme="light"
            className={styles.closeButton}
            onClick={() => onQuantityUpdate(item.meal.id, 0)}
          >
            <IoClose />
          </Button>
        )}
      </div>
      <hr />
    </div>
  );
};

export default CartItem;
