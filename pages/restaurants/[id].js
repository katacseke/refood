import React, { useContext, useState } from 'react';
import Image from 'next/image';
import { Button, Card, CardBody, CardTitle, Container } from 'shards-react';
import {
  IoCall,
  IoMail,
  IoLocationSharp,
  IoEarth,
  IoAdd,
  IoSettingsOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import MealCard from '../../components/cards/mealCard';
import MealModal from '../../components/mealModal';
import RestaurantModal from '../../components/restaurantModal';
import Layout from '../../components/layout';
import { mealService, restaurantService, userService } from '../../server/services';
import AuthContext from '../../context/authContext';
import styles from './restaurant.module.scss';

const RestauantPage = ({ restaurant, meals }) => {
  const { user } = useContext(AuthContext);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState();

  const showMeal = (meal) => {
    setSelectedMeal(meal);
    setMealModalOpen(true);
  };

  const getArticle = (word) => ('aeiouöüóőúűéáí'.includes(word.toLowerCase()[0]) ? 'Az' : 'A');

  return (
    <Layout>
      <RestaurantModal
        restaurant={restaurant}
        open={restaurantModalOpen}
        setOpen={setRestaurantModalOpen}
      />

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
            <div className="d-flex justify-content-between align-items-baseline">
              <CardTitle>{restaurant.name}</CardTitle>
              {user?.id === restaurant.ownerId && (
                <Button
                  title="Szerkesztés"
                  className="d-flex align-items-center"
                  onClick={() => setRestaurantModalOpen(true)}
                >
                  <IoSettingsOutline />
                </Button>
              )}
            </div>
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

      <MealModal meal={selectedMeal} open={mealModalOpen} setOpen={setMealModalOpen} />
      <div className="d-flex justify-content-between mx-2 align-items-baseline">
        <h3>
          {getArticle(restaurant.name)} {restaurant.name} ajánlatai
        </h3>

        {user?.id === restaurant.ownerId && (
          <Link href="/meals/create">
            <Button className="d-flex align-items-center pl-1">
              <IoAdd className="m-1" /> Új ajánlat
            </Button>
          </Link>
        )}
      </div>
      {meals.length ? (
        <Container className="d-flex flex-wrap align-content-md-stretch p-0 mx-0">
          {meals.map((meal) => (
            <MealCard key={meal.id} data={meal} onClick={() => showMeal(meal)} />
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

  const user = await userService.getUserByRestaurantId(id);

  if (!user.success) {
    return {
      notFound: true,
    };
  }

  const meals = await mealService.getCurrentMealsByRestaurant(id);

  return {
    props: {
      restaurant: JSON.parse(JSON.stringify({ ...restaurant.data, loginEmail: user.data.email })),
      meals: JSON.parse(JSON.stringify(meals.data)),
    },
  };
}