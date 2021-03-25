import { Container } from 'shards-react';
import Layout from '../../components/layout';
import Card from '../../components/card';
import { restaurantService } from '../../server/services';

const MealsPage = ({ restaurants }) => (
  <Layout>
    <h1>Vendéglők</h1>
    {restaurants.length ? (
      <Container className="d-flex flex-wrap align-content-md-stretch">
        {restaurants.map((restaurant) => (
          <Card data={restaurant} type="restaurant" />
        ))}
      </Container>
    ) : (
      <p>Jelenleg nincsenek partnereink, gyere vissza később!</p>
    )}
  </Layout>
);
export default MealsPage;

export async function getStaticProps() {
  const restaurants = await restaurantService.getRestaurants();

  return {
    props: { restaurants: JSON.parse(JSON.stringify(restaurants.data)) },
  };
}
