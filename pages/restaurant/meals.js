import { useContext, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { Container, Button } from 'shards-react';
import { IoFilter } from 'react-icons/io5';

import mealService from '@services/mealService';

import withAuthSSR, { hasRoleSSR } from '@server/middleware/withAuthSSR';
import Layout from '@components/layout';
import MealCard from '@components/cards/mealCard';
import FilterCollapse from '@components/filterCollapse';
import MealModalContext from '@context/mealModalContext';

const RestaurantMealsPage = ({ meals }) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { showMeal } = useContext(MealModalContext);

  const onFilter = (data) => {
    const queryString = new URLSearchParams(data).toString();
    Router.push(`/meals?${queryString}`);
  };

  const defaultFilters = useRouter().query;
  return (
    <Layout>
      <h1 className="mb-3">Saját ajánlatok</h1>
      <div className="mb-2">
        <Button
          className="d-flex justify-content-center"
          onClick={() => setCollapseOpen(!collapseOpen)}
        >
          <IoFilter className="mr-1" />
          Szűrés
        </Button>
        <FilterCollapse open={collapseOpen} onSubmit={onFilter} values={defaultFilters} />
      </div>

      <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
        {meals.map((meal) => (
          <MealCard key={meal.id} data={meal} onClick={() => showMeal(meal)} />
        ))}
      </Container>
      {meals.length === 0 && <p className="mt-3">Nincsenek még saját ajánlatok!</p>}
    </Layout>
  );
};

export default RestaurantMealsPage;

export const getServerSideProps = withAuthSSR(async ({ user, query }) => {
  const filters = {
    ...query,
  };
  const meals = await mealService.getMealsByRestaurant(user.restaurantId, filters);

  return {
    props: { meals: JSON.parse(JSON.stringify(meals)) },
  };
}, hasRoleSSR('restaurant'));
