import React from 'react';
import Image from 'next/image';
import { Button } from 'shards-react';
import moment from 'moment';
import 'twix';

import styles from './customCard.module.scss';

moment.locale('hu');

const MealInfromation = ({ meal }) => {
  const timeRange = moment.twix(meal.startTime, meal.endTime);

  return (
    <ul className={styles.moreInformation}>
      <li className={styles.mealLi}>Adagok: {meal.portionNumber}</li>
      <li className={styles.mealLi}>Elérhető: {timeRange.format()}</li>
      {meal?.donatable && <li className={styles.mealLi}>Adományozható</li>}
      {meal?.dailyMenu && <li className={styles.mealLi}>Napi menü</li>}
    </ul>
  );
};

const MealCard = ({ data: meal, onClick }) => {
  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });
  const notAvailable =
    !(moment() > moment(meal.startTime) && moment() < moment(meal.endTime)) ||
    meal.portionNumber === 0;
  const isOver = moment() > moment(meal.endTime) || meal.portionNumber === 0;
  const timeDifference = moment(meal.startTime).diff(moment(), 'hours', true);
  const isPreorderable = timeDifference > 0 && timeDifference <= 24 && !isOver;

  let displayMealState;
  if (isPreorderable) {
    displayMealState = 'Előrendelhető';
  } else if (notAvailable) {
    displayMealState = 'Nem elérhető';
  } else {
    displayMealState = '';
  }

  return (
    <div className={styles.card}>
      <div className={`${styles.imageContainer} ${notAvailable && styles.notAvailable}`}>
        <Image
          src={meal.image || '/default.svg'}
          alt=""
          width={300}
          height={300}
          layout="responsive"
          objectFit="cover"
        />

        <span className={styles.notAvailableText}>{displayMealState}</span>

        <Button onClick={onClick} className={styles.button}>
          Bővebben
        </Button>
      </div>

      <div className={styles.alwaysVisible}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <span className={styles.title} onClick={onClick} role="button" tabIndex="-1">
          {meal.name}
        </span>
        <p className="mt-n2 mb-2">{meal?.restaurantName}</p>
        <p>{currencyFormatter.format(meal.price)}</p>
      </div>

      <div className={styles.sometimesVisible}>
        <MealInfromation meal={meal} />
      </div>
    </div>
  );
};

export default MealCard;
