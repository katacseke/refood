import { Container } from 'shards-react';
import Layout from '../../components/layout';
import RestaurantCard from '../../components/cards/restaurantCard';
import { restaurantService } from '../../server/services';

const RestaurantsPage = ({ restaurants }) => (
  <Layout>
    <h1>Vendéglők</h1>
    {restaurants.length ? (
      <Container className="d-flex flex-wrap align-content-md-stretch">
        {restaurants.map((restaurant) => (
          <RestaurantCard data={restaurant} />
        ))}
      </Container>
    ) : (
      <p>Jelenleg nincsenek partnereink, gyere vissza később!</p>
    )}
  </Layout>
);
export default RestaurantsPage;

export async function getStaticProps() {
  const restaurants = await restaurantService.getRestaurants();

  return {
    props: { restaurants: JSON.parse(JSON.stringify(restaurants.data)) },
  };
}
