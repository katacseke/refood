import { Container } from 'shards-react';
import Layout from '../../components/layout';
import UserOrderCard from '../../components/userOrderCard';
import withAuthSSR from '../../server/middleware/withAuthSSR';
import { orderService } from '../../server/services';

const OrdersPage = ({ orders }) => {
  const activeOrders = orders.filter((order) => order.status === 'active');
  const pastOrders = orders.filter((order) => order.status !== 'active');

  return (
    <Layout>
      {activeOrders.length && <h1>Aktív rendelések</h1>}
      <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
        {activeOrders.map((order) => (
          <UserOrderCard key={order.id} order={order} />
        ))}
      </Container>
      <h1>Régebbi rendelések</h1>
      <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
        {pastOrders.map((order) => (
          <UserOrderCard key={order.id} order={order} />
        ))}
      </Container>
    </Layout>
  );
};

export const getServerSideProps = withAuthSSR(async ({ user }) => {
  const orders = await orderService.getOrdersByUser(user.id);

  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders.data)),
    },
  };
});

export default OrdersPage;
