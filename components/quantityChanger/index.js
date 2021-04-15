import { Button } from 'shards-react';
import { IoRemoveSharp, IoAddSharp, IoTrash } from 'react-icons/io5';
import styles from './quantityChanger.module.scss';

const QuantityChanger = ({ quantity, onSubtract, onAdd, max }) => (
  <div className="d-inline-flex align-items-baseline">
    <Button pill className={`p-1 ${styles.button}`} onClick={onSubtract}>
      {quantity > 1 ? <IoRemoveSharp /> : <IoTrash />}
    </Button>
    <p className={styles.quantity}>{quantity}</p>
    <Button pill className={`p-1 ${styles.button}`} disabled={quantity >= max} onClick={onAdd}>
      <IoAddSharp />
    </Button>
  </div>
);

QuantityChanger.defaultProps = {
  max: 99,
};

export default QuantityChanger;
