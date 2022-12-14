import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { Container, Badge, Button, FormInput, Tooltip } from 'shards-react';
import { IoCartOutline, IoHeart, IoSettingsOutline, IoTrashOutline } from 'react-icons/io5';
import moment from 'moment';
import 'twix';

import AuthContext from '@context/authContext';
import { useRouter } from 'next/router';
import CartContext from '@context/cartContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import styles from './modal.module.scss';

moment.locale('hu');

const DisplayMeal = ({ meal, onTabChange, toggleOpen }) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { addCartItem } = useContext(CartContext);
  const [selectedPortions, setSelectedPortions] = useState(1);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => setSelectedPortions(1), [meal]);

  const handleAddToCart = async (donation = false) => {
    if (selectedPortions > meal.portionNumber || selectedPortions < 1) {
      toast.error('Ez a mennyiség nem rendelhető meg!');
      return;
    }

    const cartItem = {
      meal: meal.id,
      quantity: selectedPortions,
      donation,
    };

    try {
      const promise = addCartItem(cartItem);

      await toast.promise(
        promise,
        {
          loading: 'Kosár frissítése...',
          success: 'Kosárba tetted!',
          error: (err) =>
            err.response.data.error ||
            err.response.data.general?.message ||
            'A kosár frissítése sikertelen!',
        },
        { style: { minWidth: '18rem' } }
      );

      toggleOpen(false);
    } catch (err) {}
  };

  const handleDelete = async () => {
    try {
      const promise = axios.delete(`/api/meals/${meal.id}`);

      await toast.promise(
        promise,
        {
          loading: 'Étel törlése folyamatban...',
          success: 'Étel törölve!',
          error: (err) =>
            err.response.data.error ||
            err.response.data.general?.message ||
            'Étel törlése sikertelen!',
        },
        { style: { minWidth: '18rem' } }
      );

      toggleOpen(false);
      router.replace(router.pathname);
    } catch (err) {}
  };

  const timeRange = moment.twix(meal.startTime, meal.endTime);
  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });
  const notAvailable =
    !(moment() > moment(meal.startTime) && moment() < moment(meal.endTime)) ||
    meal.portionNumber === 0;
  const isOver = moment() > moment(meal.endTime) || meal.portionNumber === 0;
  const timeDifference = moment(meal.startTime).diff(moment(), 'hours', true);
  const isPreorderable = timeDifference > 0 && timeDifference <= 24 && !isOver;

  let displayMealState = '';

  if (isPreorderable) {
    displayMealState = 'Előrendelhető';
  } else if (notAvailable) {
    displayMealState = 'Nem elérhető';
  }

  return (
    <>
      <div className={`${styles.imageContainer} ${notAvailable && styles.notAvailable}`}>
        <span className={styles.notAvailableText}>{displayMealState}</span>
        <Image src={meal.image || '/default.svg'} alt="" layout="fill" objectFit="cover" />
      </div>

      <div className={styles.content}>
        <h4 className="mb-0">{meal.name}</h4>
        <p className="mb-2">{meal?.restaurantName}</p>
        <h5 className="mb-2">{currencyFormatter.format(meal.price)}</h5>

        <ul className={styles.moreInformation}>
          <li className={styles.mealLi}>Adagok: {meal.portionNumber}</li>
          <li className={styles.mealLi}>Elérhető: {timeRange.format()}</li>
          {meal?.donatable && <li className={styles.mealLi}>Adományozható</li>}
          {meal?.dailyMenu && <li className={styles.mealLi}>Napi menü</li>}
        </ul>

        <Container className="mb-3 pl-0">
          {meal.tags.map((tag) => (
            <Badge className="mr-1" key={tag} theme="light">
              {tag}
            </Badge>
          ))}
        </Container>

        {user?.restaurantId === meal.restaurantId ? (
          <div className="d-flex">
            <Button
              theme="danger"
              title="Törlés"
              className="d-flex align-items-cente mr-1"
              onClick={handleDelete}
            >
              <IoTrashOutline />
            </Button>
            <Button title="Szerkesztés" className="d-flex align-items-center" onClick={onTabChange}>
              <IoSettingsOutline />
            </Button>
          </div>
        ) : (
          <>
            <label htmlFor="quantitiy">Mennyiség</label>
            <div className={styles.buttonContainer}>
              <div>
                <FormInput
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={selectedPortions}
                  onChange={(e) => setSelectedPortions(parseInt(e.target.value, 10))}
                  min="1"
                  max={meal.portionNumber}
                />
              </div>
              <div id="cartButton">
                <Button
                  onClick={() => handleAddToCart()}
                  className="col d-inline-flex align-items-center justify-content-center"
                  disabled={!user || isOver}
                >
                  <IoCartOutline className="mr-1" />
                  Kosárba
                </Button>
                {!user && (
                  <Tooltip
                    open={tooltipOpen}
                    target="#cartButton"
                    toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    Rendeléshez jelentkezz be!
                  </Tooltip>
                )}
                {isOver && (
                  <Tooltip
                    open={tooltipOpen}
                    target="#cartButton"
                    toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    Ez az ajánlat már nem elérhető, kérlek válassz valami mást!
                  </Tooltip>
                )}
              </div>
              {meal.donatable && (
                <div id="donateButton">
                  <Button
                    theme="success"
                    onClick={() => handleAddToCart(true)}
                    className="col d-inline-flex align-items-center justify-content-center"
                    disabled={!user || isOver}
                  >
                    <IoHeart className="mr-1" />
                    Adományozás
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DisplayMeal;
