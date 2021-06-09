import { useContext, useState } from 'react';
import Router from 'next/router';
import toast from 'react-hot-toast';
import { Button, Card, CardBody, CardTitle, Tooltip } from 'shards-react';
import { IoCartOutline } from 'react-icons/io5';

import withAuthSSR, { hasRoleSSR } from '@middleware/withAuthSSR';

import AuthContext from '@context/authContext';
import Layout from '@components/layout';
import CartContext from '@context/cartContext';
import CartItem from '@components/cartItem';
import axios from 'axios';
import styles from './cart.module.scss';

const CartPage = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { cart, updateCartItem, deleteCartContent, refresh } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const handleUpdate = async (mealId, donation, newQuantity) => {
    try {
      await updateCartItem({ meal: mealId, quantity: newQuantity, donation });
    } catch (err) {
      const body = err.response.data;
      toast.error(body.error || body.general.message);
    }
  };

  const handleDelete = async () => {
    const promise = deleteCartContent();

    toast.promise(
      promise,
      {
        loading: 'Kosár ürítése...',
        success: 'Kosár sikeresen kiürítve!',
        error: 'Nem sikerült kiüríteni a kosarat!',
      },
      { style: { minWidth: '18rem' } }
    );
  };

  const placeOrder = async () => {
    try {
      const promise = axios.post(`/api/users/${user.id}/orders`);

      await toast.promise(
        promise,
        {
          loading: 'Rendelés rögzítése...',
          success: 'A rendelésedet rögzítettük.',
          error: (err) => err.response.data.error || err.response.data.general.message,
        },
        { style: { minWidth: '18rem' } }
      );

      refresh(); // refresh cart model in Cart Context
      Router.push('/orders');
    } catch {}
  };

  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });
  const totalPrice = cart.items
    ?.filter((item) => !item.meal.deleted)
    .reduce((acc, item) => acc + item.quantity * item.meal.price, 0);
  const deletedItem = cart.items.find((item) => item.meal.deleted);

  return (
    <Layout requiresAuth>
      <Card size="lg" className="mb-5">
        <CardBody>
          <CardTitle tag="h3" className="d-flex align-items-center">
            <IoCartOutline className="mr-1" />
            Kosár
          </CardTitle>
          {cart.restaurant && <h4>Rendelés a következő helyről: {cart.restaurant.name}</h4>}
          <>
            {cart.items?.length > 0 ? (
              <div>
                {cart.items.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    showRemoveButton
                    showQuantityChanger
                    onQuantityUpdate={handleUpdate}
                  />
                ))}
                <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
                  <p className={styles.mealName}>Összesen</p>

                  <p className="pl-5 mb-1 font-weight-bold">
                    {currencyFormatter.format(totalPrice)}
                  </p>
                </div>
                <hr />
                <div className="d-flex justify-content-end pt-2">
                  <Button className={styles.removeAllButton} onClick={handleDelete}>
                    Kosár ürítése
                  </Button>
                  <div id="placeOrderButton">
                    <Button onClick={placeOrder} disabled={deletedItem}>
                      Rendelés leadása
                    </Button>
                    {deletedItem && (
                      <Tooltip
                        open={tooltipOpen}
                        target="#placeOrderButton"
                        toggle={() => setTooltipOpen(!tooltipOpen)}
                      >
                        {`A ${deletedItem.meal.name} étel nem elérhető, kérlek vedd ki a kosaradból.`}
                      </Tooltip>
                    )}
                  </div>
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

export const getServerSideProps = withAuthSSR(async () => ({ props: {} }), hasRoleSSR('user'));

export default CartPage;
