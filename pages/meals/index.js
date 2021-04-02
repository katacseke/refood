import { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { Container, FormInput, FormGroup, Badge } from 'shards-react';
import Layout from '../../components/layout';
import Card from '../../components/card';
import MealModal from '../../components/mealModal';
import { mealService } from '../../server/services';
import ChipInput from '../../components/chipInput';

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

  const { control } = useForm();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState();
  const [selectedTags, setSelectedTags] = useState([]);

  const showMeal = (meal) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };

  const handleSearch = (e) => {
    if (e.key !== 'Enter' && e.keyCode !== 13) {
      return;
    }

    const text = e.target.value;
    if (text !== '') {
      Router.push(`/search/${text}`);
    }
  };

  return (
    <Layout>
      <MealModal meal={selectedMeal} open={modalOpen} setOpen={setModalOpen} />
      <h1>Jelenleg elérhető ajánlatok</h1>
      <div>
        <h3>Szűrés</h3>
        <FormInput
          placeholder="Keress név, vagy vendéglő szerint..."
          name="searchBar"
          id="searchBar"
          onKeyPress={handleSearch}
        />

        <Container className="m-0 mb-2 mt-2 p-0 d-flex justify-content-sm-between">
          {tags.map((tag) => (
            <Badge
              style={{ cursor: 'pointer' }}
              key={tag}
              onClick={() => setSelectedTags([...selectedTags, tag])}
            >
              {tag}
            </Badge>
          ))}
        </Container>

        <FormGroup>
          <label className="d-block">Szűrés személyre szabott kulcsszó alapján</label>
          <ChipInput name="tags" control={control} placeholder="Kulcsszó hozzáadása..." />
        </FormGroup>
      </div>
      {meals.length ? (
        <Container className="m-0 p-0 d-flex flex-wrap align-content-md-stretch">
          {selectedTags.length
            ? meals
                .filter((meal) => selectedTags.some((tag) => meal.tags.includes(tag)))
                .map((meal) => (
                  <Card key={meal._id} data={meal} type="meal" onClick={() => showMeal(meal)} />
                ))
            : meals.map((meal) => (
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
