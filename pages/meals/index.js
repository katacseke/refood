import { Container } from 'shards-react';
import Layout from '../../components/layout';
import Card from '../../components/card';
import { mealService } from '../../server/services';

const MealsPage = ({ meals }) => (
  <Layout>
    <h1>Jelenleg elérhető ajánlatok:</h1>
    {meals.length ? (
      <Container className="d-flex flex-wrap align-content-md-stretch">
        {meals.map((meal) => (
          <Card meal={meal} />
        ))}
      </Container>
    ) : (
      <p>Jelenleg nincsenek elérhető ajánlatok, gyere vissza később!</p>
    )}
  </Layout>
);
export default MealsPage;

export async function getStaticProps() {
  const meals = await mealService.getCurrentMeals();

  return {
    props: { meals: JSON.parse(JSON.stringify(meals.data)) },
  };
}
