import { Container } from 'shards-react';
import Layout from '../../components/layout';
import Card from '../../components/card';
import { mealService, restaurantService } from '../../server/services';

const SearchResultPage = ({ meals, restaurants, text }) => (
  <Layout>
    <h1>Találatok a következőre: {text}</h1>
    <Container className="d-flex flex-wrap align-content-md-stretch">
      {meals.map((meal) => (
        <Card data={meal} type="meal" />
      ))}
    </Container>
    <Container className="d-flex flex-wrap align-content-md-stretch">
      {restaurants.map((restaurant) => (
        <Card data={restaurant} type="restaurant" />
      ))}
    </Container>
  </Layout>
);
export default SearchResultPage;

export async function getServerSideProps({ params }) {
  const { searchText } = params;
  const meals = await mealService.getMealsWithName(searchText);
  const restaurants = await restaurantService.getRestaurantsWithName(params.searchText);

  return {
    props: {
      text: searchText,
      meals: JSON.parse(JSON.stringify(meals.data)),
      restaurants: JSON.parse(JSON.stringify(restaurants.data)),
    },
  };
}
