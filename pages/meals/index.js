import { useState } from 'react';
import { Container, Button } from 'shards-react';
import { IoFilter } from 'react-icons/io5';
import Router, { useRouter } from 'next/router';
import { useTransition, animated } from 'react-spring';
import Layout from '../../components/layout';
import MealCard from '../../components/cards/mealCard';
import MealModal from '../../components/mealModal';
import FilterCollapse from '../../components/filterCollapse';
import { mealService } from '../../server/services';

const MealsPage = ({ meals }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState();

  const showMeal = (meal) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };

  const onFilter = (data) => {
    const queryString = new URLSearchParams(data).toString();
    Router.push(`/meals?${queryString}`);
  };

  const transitions = useTransition(meals, (meal) => meal.id, {
    unique: true,
    trail: 400 / meals.length,
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' },
    config: {
      tension: 60,
      friction: 15,
    },
  });

  const defaultFilters = useRouter().query;
  return (
    <Layout>
      <MealModal meal={selectedMeal} open={modalOpen} setOpen={setModalOpen} />
      <h1 className="mb-3">Jelenleg elérhető ajánlatok</h1>
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

      {meals.length ? (
        <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
          {transitions.map(({ item, props, key }) => (
            <animated.div key={key} style={props}>
              <MealCard data={item} onClick={() => showMeal(item)} />
            </animated.div>
          ))}
        </Container>
      ) : (
        <p>Jelenleg nincsenek elérhető ajánlatok, gyere vissza később!</p>
      )}
    </Layout>
  );
};

export default MealsPage;

export async function getServerSideProps(context) {
  const filters = {
    startTime: Date.now(),
    endTime: Date.now(),
    ...context.query,
  };

  const meals = await mealService.getMeals(filters);

  return {
    props: { meals: JSON.parse(JSON.stringify(meals.data)) },
  };
}
