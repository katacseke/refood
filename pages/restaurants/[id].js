import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardBody, CardTitle, Container } from 'shards-react';
import { IoCall, IoMail, IoLocationSharp, IoEarth } from 'react-icons/io5';
import MealCard from '../../components/cards/mealCard';
import MealModal from '../../components/mealModal';
import Layout from '../../components/layout';
import { mealService, restaurantService } from '../../server/services';
import styles from './restaurant.module.scss';

const RestauantPage = ({ restaurant, meals }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState();

  const showMeal = (meal) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };

  const getArticle = (word) => ('aeiouöüóőúűéáí'.includes(word.toLowerCase()[0]) ? 'Az' : 'A');

  return (
    <Layout>
      <Card size="lg" className="m-2 mb-5">
        <CardBody className={styles.mainContainer}>
          <div className={styles.image}>
            <Image
              src="https://interactive-examples.mdn.mozilla.net/media/examples/plumeria.jpg"
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className={styles.content}>
            <CardTitle>{restaurant.name}</CardTitle>
            <p>{restaurant.description}</p>

            <ul className={styles.moreInformation}>
              <li>
                <IoLocationSharp className="mr-1" /> {restaurant.address}
              </li>
              <li>
                <IoCall className="mr-1" /> {restaurant.phone}
              </li>
              <li>
                <IoMail className="mr-1" /> {restaurant.email}
              </li>
              {restaurant.url && (
                <li>
                  <IoEarth className="mr-1" /> {restaurant.url}
                </li>
              )}
            </ul>
          </div>
        </CardBody>
      </Card>

      <MealModal meal={selectedMeal} open={modalOpen} setOpen={setModalOpen} />

      <h3>
        {getArticle(restaurant.name)} {restaurant.name} ajánlatai
      </h3>
      {meals.length ? (
        <Container className="d-flex flex-wrap align-content-md-stretch p-0 mx-0">
          {meals.map((meal) => (
            <MealCard key={meal._id} data={meal} onClick={() => showMeal(meal)} />
          ))}
        </Container>
      ) : (
        <p>Jelenleg nincsenek elérhető ajánlatok, gyere vissza később!</p>
      )}
    </Layout>
  );
};

export default RestauantPage;

export async function getStaticPaths() {
  const ids = await restaurantService.getRestaurantIds();
  const paths = ids.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ res, params }) {
  const { id } = params;
  const restaurant = await restaurantService.getRestaurantById(id);

  if (!restaurant.success) {
    res.writeHead(302, { Location: '/404' });
    res.end();
  }

  const meals = await mealService.getCurrentMealsByRestaurant(id);

  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant.data)),
      meals: JSON.parse(JSON.stringify(meals.data)),
    },
  };
}
