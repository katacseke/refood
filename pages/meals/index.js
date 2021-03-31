import { Container } from 'shards-react';
import { useState } from 'react';
import Layout from '../../components/layout';
import Card from '../../components/card';
import MealModal from '../../components/mealModal';
import { mealService } from '../../server/services';

const MealsPage = ({ meals }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState();

  const showMeal = (meal) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };

  return (
    <Layout>
      <MealModal meal={selectedMeal} open={modalOpen} setOpen={setModalOpen} />
      <h1>Jelenleg elérhető ajánlatok</h1>
      {meals.length ? (
        <Container className="d-flex flex-wrap align-content-md-stretch">
          {meals.map((meal) => (
            <Card key={meal._id} data={meal} type="meal" onClick={() => showMeal(meal)} />
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
