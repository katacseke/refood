import { Container } from 'shards-react';

import orderService from '@services/orderService';
import withAuthSSR from '@middleware/withAuthSSR';

import Layout from '@components/layout';
import UserOrderCard from '@components/cards/userOrderCard';

const UserOrdersPage = ({ orders }) => {
  const activeOrders = orders.filter((order) => order.status === 'active');
  const pastOrders = orders.filter((order) => order.status !== 'active');

  return (
    <Layout>
      {activeOrders.length > 0 && <h2>Aktív rendelések</h2>}
      <Container className="m-0 mb-3 p-0 d-flex flex-wrap w-100 justify-content-center">
        {activeOrders.map((order) => (
          <UserOrderCard key={order.id} order={order} />
        ))}
      </Container>

      {pastOrders.length > 0 && <h2>Lezárult rendelések</h2>}
      <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
        {pastOrders.map((order) => (
          <UserOrderCard key={order.id} order={order} />
        ))}
      </Container>
      {orders.length === 0 && <h3>Nincsenek rendelések</h3>}
    </Layout>
  );
};

export const getServerSideProps = withAuthSSR(async ({ user }) => {
  try {
    const orders = await orderService.getOrdersByUser(user.id);

    return {
      props: {
        orders: JSON.parse(JSON.stringify(orders)),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
});

export default UserOrdersPage;
