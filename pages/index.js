import { useContext } from 'react';
import Layout from '../components/layout';
import { mealService } from '../server/services';
import AuthContext from '../context/authContext';

const Home = ({ meals }) => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <h1>Üdvözlünk {user && user.name}!</h1>
      <h3>
        Tudtad, hogy 2019-ben Románia 5 millió tonna ételfelesleget termelt? Most te is
        hozzájárulhatsz, hogy ez változhasson! Alkalmazásunk segítségével helyi vendéglők, kávézók
        fennmaradt termélei vásárolhatók meg!
      </h3>
      <p>Meals: {meals.map((meal) => meal.name).join(', ')}</p>
    </Layout>
  );
};

export default Home;

export async function getStaticProps() {
  const meals = await mealService.getMeals();

  return {
    props: { meals: JSON.parse(JSON.stringify(meals.data)) },
  };
}
