import { useState } from 'react';
import { Container, Button } from 'shards-react';
import Layout from '../../components/layout';
import MealCard from '../../components/cards/mealCard';
import MealModal from '../../components/mealModal';
import FilterCollapse from '../../components/filterCollapse';
import { mealService } from '../../server/services';

const MealsPage = ({ meals }) => {
  const tags = [
    'vegetáriánus',
    'vegán',
    'gluténmentes',
    'egészséges',
    'gyerekbarát',
    'pizza',
    'hagyományos',
    'reggeli',
    'leves',
    'főétel',
    'napi menü',
    'pékáru',
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState();
  const [selectedTags, setSelectedTags] = useState([]);

  const showMeal = (meal) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };

  return (
    <Layout>
      <MealModal meal={selectedMeal} open={modalOpen} setOpen={setModalOpen} />
      <h1>Jelenleg elérhető ajánlatok</h1>
      <div>
        <Button onClick={() => setCollapseOpen(!collapseOpen)}>Szűrés</Button>
        <FilterCollapse open={collapseOpen} />
      </div>

      {meals.length ? (
        <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
          {selectedTags.length
            ? meals
                .filter((meal) => selectedTags.some((tag) => meal.tags.includes(tag)))
                .map((meal) => (
                  <MealCard key={meal._id} data={meal} onClick={() => showMeal(meal)} />
                ))
            : meals.map((meal) => (
                <MealCard key={meal._id} data={meal} onClick={() => showMeal(meal)} />
              ))}
        </Container>
      ) : (
        <p>Jelenleg nincsenek elérhető ajánlatok, gyere vissza később!</p>
      )}
    </Layout>
  );
};
export default MealsPage;

export async function getStaticProps() {
  const meals = await mealService.getCurrentMeals();

  return {
    props: { meals: JSON.parse(JSON.stringify(meals.data)) },
  };
}
