import { useContext } from 'react';
import { Button, Card, CardBody, CardTitle } from 'shards-react';
import { IoCartOutline, IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import Layout from '../../components/layout';
import CartContext from '../../context/cartContext';
import styles from './cart.module.scss';
import QuantityChanger from '../../components/quantityChanger';

const CartPage = () => {
  const { cart, updateCartItem, deleteCartContent } = useContext(CartContext);

  const handleUpdate = async (mealId, newQuantity) => {
    try {
      await updateCartItem({ meal: mealId, quantity: newQuantity });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });

  const totalPrice = cart.items?.reduce((acc, item) => acc + item.quantity * item.meal.price, 0);

  const renderCartItem = (item) => (
    <div key={item.meal.id}>
      <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
        <p className={styles.mealName}>{item.meal.name}</p>

        <p className="pl-5 mb-1">{currencyFormatter.format(item.meal.price * item.quantity)}</p>
      </div>
      <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
        <QuantityChanger
          quantity={item.quantity}
          onAdd={() => handleUpdate(item.meal.id, item.quantity + 1)}
          onSubtract={() => handleUpdate(item.meal.id, item.quantity - 1)}
          max={item.meal.portionNumber}
        />
        <Button
          theme="light"
          className={styles.closeButton}
          onClick={() => updateCartItem({ meal: item.meal.id, quantity: 0 })}
        >
          <IoClose />
        </Button>
      </div>
      <hr />
    </div>
  );

  return (
    <Layout>
      <Card size="lg" className="m-2 mb-5">
        <CardBody>
          <CardTitle tag="h3" className="d-flex align-items-center">
            <IoCartOutline className="mr-1" />
            Kosár
          </CardTitle>
          {cart.restaurant && <h4>Rendelés a következő helyről: {cart.restaurant.name}</h4>}
          <>
            {cart.items?.length > 0 ? (
              <div>
                {cart.items.map(renderCartItem)}
                <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
                  <p className={styles.mealName}>Összesen</p>

                  <p className="pl-5 mb-1 font-weight-bold">
                    {currencyFormatter.format(totalPrice)}
                  </p>
                </div>
                <hr />
                <div className="d-flex justify-content-end pt-2">
                  <Button className={styles.removeAllButton} onClick={deleteCartContent}>
                    Kosár ürítése
                  </Button>
                  <Button>Rendelés</Button>
                </div>
              </div>
            ) : (
              <p className="text-center mb-0">A kosár üres.</p>
            )}
          </>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default CartPage;
