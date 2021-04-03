import React from 'react';
import { Button } from 'shards-react';
import styles from './card.module.scss';

const MealInfromation = ({ data }) => {
  const start = data.startTime.toString().replace(/T/, ' ').replace(/\..+/, '');
  const end = data.endTime.toString().replace(/T/, ' ').replace(/\..+/, '');

  return (
    <ul className={styles.moreInformation}>
      <li className={styles.mealLi}>Adagok: {data.portionNumber}</li>
      <li className={styles.mealLi}>
        Elérhető: {start} - {end}
      </li>
      {data?.donatable && <li className={styles.mealLi}>Adományozható</li>}
      {data?.dailyMenu && <li className={styles.mealLi}>Napi menü</li>}
    </ul>
  );
};

const MealCard = ({ data, onClick }) => (
  <div className={styles.card}>
    <div className={styles.imageContainer}>
      <img
        className={styles.image}
        src="https://discovernative.org/wp-content/uploads/2020/05/food.jpg"
        alt=""
      />
      <Button onClick={onClick} className={styles.button}>
        Bővebben
      </Button>
    </div>

    <div className={styles.alwaysVisible}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <span className={styles.title} onClick={onClick} role="button" tabIndex="-1">
        {data.name}
      </span>
      <p>{data.price} lej</p>
    </div>

    <div className={styles.sometimesVisible}>
      <MealInfromation data={data} />
    </div>
  </div>
);

export default MealCard;
