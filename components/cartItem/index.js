import { Button } from 'shards-react';
import { IoClose } from 'react-icons/io5';

import QuantityChanger from '@components/quantityChanger';
import styles from './cartItem.module.scss';

const CartItem = ({ item, showRemoveButton, showQuantityChanger, onQuantityUpdate }) => {
  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });
  const itemPrice = `${item.quantity} x ${currencyFormatter.format(item.meal.price)}`;
  const isDeleted = item.meal.deleted;

  return (
    <div className={item?.donation && styles.donation}>
      <div
        className={`d-flex flex-nowrap align-items-baseline justify-content-between ${
          isDeleted && styles.deleted
        }`}
      >
        <p className={styles.mealName}>{item.meal.name}</p>

        <p className="pl-2 mb-1 text-right">{isDeleted ? 'Nem elérhető' : itemPrice}</p>
      </div>
      <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
        {showQuantityChanger && !isDeleted && (
          <QuantityChanger
            quantity={item.quantity}
            onAdd={() => onQuantityUpdate(item.meal.id, item.donation, item.quantity + 1)}
            onSubtract={() => onQuantityUpdate(item.meal.id, item.donation, item.quantity - 1)}
            max={item.meal.portionNumber}
          />
        )}

        {showRemoveButton && (
          <Button
            theme="light"
            className={styles.closeButton}
            onClick={() => onQuantityUpdate(item.meal.id, item.donation, 0)}
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
