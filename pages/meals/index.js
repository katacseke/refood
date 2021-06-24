import { useContext, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { Container, Button } from 'shards-react';
import { IoFilter } from 'react-icons/io5';

import mealService from '@services/mealService';

import Layout from '@components/layout';
import MealCard from '@components/cards/mealCard';
import FilterCollapse from '@components/filterCollapse';
import MealModalContext from '@context/mealModalContext';

const MealsPage = ({ meals }) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { showMeal } = useContext(MealModalContext);

  const onFilter = (data) => {
    const queryString = new URLSearchParams(data).toString();
    Router.push(`/meals?${queryString}`);
  };

  const defaultFilters = useRouter().query;
  return (
    <Layout>
      <h1 className="mb-3">
        {Object.keys(defaultFilters).length === 0 ? 'Jelenleg elérhető ajánlatok' : 'Ajánlatok'}
      </h1>
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
      {meals.length === 0 && (
        <p className="mt-3">
          Nincsenek a keresési feltételnek megfelelő ajánlatok, gyere vissza később!
        </p>
      )}
    </Layout>
  );
};

export default MealsPage;

export const getServerSideProps = async (context) => {
  const filters = {
    startTime: Date.now(),
    endTime: Date.now(),
    minPortionNumber: 1,
    ...context.query,
  };

  const meals = await mealService.getMeals(filters);

  return {
    props: { meals: JSON.parse(JSON.stringify(meals)) },
  };
};
