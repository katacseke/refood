import { useContext } from 'react';
import { Container } from 'shards-react';

import { mealService, restaurantService } from '@server/services';

import MealModalContext from '@context/mealModalContext';
import Layout from '@components/layout';
import MealCard from '@components/cards/mealCard';
import RestaurantCard from '@components/cards/restaurantCard';

const SearchResultPage = ({ meals, restaurants, text }) => {
  const { showMeal } = useContext(MealModalContext);

  return (
    <Layout>
      <h1>Találatok a következőre: {text}</h1>
      <Container className="d-flex flex-wrap align-content-md-stretch">
        {meals.map((meal) => (
          <MealCard data={meal} onClick={() => showMeal(meal)} />
        ))}
      </Container>
      <Container className="d-flex flex-wrap align-content-md-stretch">
        {restaurants.map((restaurant) => (
          <RestaurantCard data={restaurant} />
        ))}
      </Container>
    </Layout>
  );
};
export default SearchResultPage;

export async function getServerSideProps({ params }) {
  const { searchText } = params;

  const meals = await mealService.getMeals({ name: searchText });
  const restaurants = await restaurantService.getRestaurantsWithName(searchText);

  return {
    props: {
      text: searchText,
      meals: JSON.parse(JSON.stringify(meals)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
    },
  };
}
