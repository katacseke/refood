import { Container } from 'shards-react';

import restaurantService from '@services/restaurantService';
import Layout from '@components/layout';
import RestaurantCard from '@components/cards/restaurantCard';

const RestaurantsPage = ({ restaurants }) => (
  <Layout>
    <h1>Vendéglők</h1>
    {restaurants.length ? (
      <Container className="d-flex flex-wrap align-content-md-stretch">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} data={restaurant} />
        ))}
      </Container>
    ) : (
      <p>Jelenleg nincsenek partnereink, gyere vissza később!</p>
    )}
  </Layout>
);
export default RestaurantsPage;

export const getStaticProps = async () => {
  const restaurants = await restaurantService.getRestaurants();

  return {
    props: { restaurants: JSON.parse(JSON.stringify(restaurants)) },
    revalidate: 60,
  };
};
