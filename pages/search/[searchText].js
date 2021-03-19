import { Layout } from '../../components';
import { mealService, restaurantService } from '../../server/services';

const SearchResultPage = ({ meals, restaurants }) => (
  <Layout>
    <h1>Results:</h1>
    <p>{meals.length ? meals.map((result) => result.name).join(', ') : '...'}</p>
    <p>{restaurants.length ? restaurants.map((result) => result.name).join(', ') : '...'}</p>
  </Layout>
);
export default SearchResultPage;

export async function getServerSideProps({ params }) {
  const meals = await mealService.getMealsWithName(params.searchText);
  const restaurants = await restaurantService.getRestaurantsWithName(params.searchText);

  return {
    props: {
      meals: JSON.parse(JSON.stringify(meals.data)),
      restaurants: JSON.parse(JSON.stringify(restaurants.data)),
    },
  };
}
