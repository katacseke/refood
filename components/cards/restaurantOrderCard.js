import { useContext } from 'react';
import Router from 'next/router';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Button, Card, CardBody, CardFooter, CardTitle } from 'shards-react';
import { IoAlertCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

import AuthContext from '@context/authContext';
import CartItem from '@components/cartItem';
import styles from './shardsReactCard.module.scss';

const RestaurantOrderCard = ({ order }) => {
  const { user } = useContext(AuthContext);

  const handleOrder = async (status) => {
    try {
      const promise = axios.patch(`/api/restaurants/${user.restaurantId}/orders/${order.id}`, {
        status,
      });

      await toast.promise(
        promise,
        {
          loading: 'Rendelés állapotának frissítése folyamatban...',
          success: `Rendelés ${status === 'finished' ? 'átadva' : 'elutasítva'}.`,
          error: (err) =>
            err.error || err.general.message || 'A rendelés állapotának frissítése sikertelen!',
        },
        { style: { minWidth: '18rem' } }
      );

      Router.replace('/restaurant/orders');
    } catch (err) {}
  };

  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });
  const totalPrice = order.items.reduce((acc, item) => acc + item.quantity * item.meal.price, 0);

  return (
    <Card className={styles.card}>
      <CardBody>
        <CardTitle>{order.user.name}</CardTitle>
        {order.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
          <p className={styles.mealName}>Összesen</p>

          <p className="pl-5 mb-1 font-weight-bold">{currencyFormatter.format(totalPrice)}</p>
        </div>
      </CardBody>

      <CardFooter className={styles.footer}>
        {order.status === 'active' && (
          <>
            <Button
              active
              theme="success"
              className={styles.button}
              onClick={() => handleOrder('finished')}
            >
              <IoCheckmarkCircleOutline className="mr-1" size={20} /> Befejezés
            </Button>
            <Button
              active
              theme="danger"
              className={styles.button}
              onClick={() => handleOrder('denied')}
            >
              <IoAlertCircleOutline className="mr-1" size={20} /> Elutasítás
            </Button>
          </>
        )}
        {order.status === 'finished' && (
          <p className="text-success my-2 text-center flex-grow-1">
            <IoCheckmarkCircleOutline className="mr-1" /> Rendelés átadva
          </p>
        )}
        {order.status === 'denied' && (
          <p className="text-danger my-2 text-center flex-grow-1">
            <IoAlertCircleOutline className="mr-1" /> Rendelés elutasítva
          </p>
        )}
        {order.status === 'canceled' && (
          <p className="text-danger my-2 text-center flex-grow-1">
            <IoAlertCircleOutline className="mr-1" /> Rendelés lemondva
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default RestaurantOrderCard;
