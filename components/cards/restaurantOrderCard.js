import { Button, Card, CardBody, CardFooter, CardTitle } from 'shards-react';
import { IoAlertCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import Router from 'next/router';
import styles from './orderCard.module.scss';
import AuthContext from '../../context/authContext';

const RestaurantOrderCard = ({ order }) => {
  const { user } = useContext(AuthContext);

  const handleOrder = async (status) => {
    const res = await fetch(`/api/restaurants/${user.restaurantId}/orders/${order.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || err.general.message);

      return;
    }

    toast.success(`Rendelés ${status === 'finished' ? 'átadva' : 'elutasítva'}.`);
    Router.push('/restaurant/orders');
  };

  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });

  const totalPrice = order.items.reduce((acc, item) => acc + item.quantity * item.meal.price, 0);

  const renderCartItem = (item) => (
    <div key={item.meal.id}>
      <div className="d-flex flex-nowrap align-items-baseline justify-content-between">
        <p className={styles.mealName}>{item.meal.name}</p>

        <p className="pl-2 mb-1">
          {item.quantity} x {currencyFormatter.format(item.meal.price)}
        </p>
      </div>
      <hr />
    </div>
  );

  return (
    <Card className={styles.card}>
      <CardBody>
        <CardTitle>{order.user.name}</CardTitle>
        {order.items.map(renderCartItem)}
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
