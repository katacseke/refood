import { Container } from 'shards-react';

import orderService from '@services/orderService';
import withAuthSSR, { hasRoleSSR } from '@middleware/withAuthSSR';

import Layout from '@components/layout';
import RestaurantOrderCard from '@components/cards/restaurantOrderCard';

const RestaurantOrdersPage = ({ orders }) => {
  const activeOrders = orders.filter((order) => order.status === 'active');
  const pastOrders = orders.filter((order) => order.status !== 'active');

  return (
    <Layout>
      {activeOrders.length > 0 && <h1>Aktív rendelések</h1>}
      <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
        {activeOrders.map((order) => (
          <RestaurantOrderCard key={order.id} order={order} />
        ))}
      </Container>
      {pastOrders.length > 0 && <h1>Lezárt rendelések</h1>}
      <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
        {pastOrders.map((order) => (
          <RestaurantOrderCard key={order.id} order={order} />
        ))}
      </Container>
      {orders.length === 0 && <h3>Nincsenek rendelések</h3>}
    </Layout>
  );
};

export const getServerSideProps = withAuthSSR(async ({ user }) => {
  const orders = await orderService.getOrdersByRestaurant(user.restaurantId);
  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}, hasRoleSSR('restaurant'));

export default RestaurantOrdersPage;
