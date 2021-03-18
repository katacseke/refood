import { Layout } from '../components';
import { mealService } from '../server/services';

const Home = ({ meals }) => (
  <Layout>
    <p>Meals: {meals.map((meal) => meal.name).join(', ')}</p>
    <p>
      Food waste is a major problem that is concerning modern world and affects all developed
      countries. Many international organisations tries to implement programs to reduce the food
      waste because it concerns the environment, social and economic issues. Romania doesn’t have a
      food waste in the same size as other countries from European Union, but also doesn’t have a
      high standard of living and high income per capita. In this paper we conduct a qualitative
      research through structured interview with NGOs that are present in the food waste problem to
      discover good practice for developing a method of cooperation between companies that are
      producing and selling food and NGOs that are donating food for poor people or for people that
      have social care. Some of the findings suggest developing the concept of food bank in Romania,
      which is only a beginning, develop information campaigns for population, build canteen near
      retailer and develop partnership with universities. The study is limited by small number of
      NGOs questioned and should be continued with focus group and quantitative research among
      population.
    </p>
  </Layout>
);

export default Home;

export async function getStaticProps() {
  const meals = await mealService.getMeals();

  return {
    props: { meals: JSON.parse(JSON.stringify(meals.data)) },
  };
}
