import React from 'react';
import Link from 'next/link';
import styles from './card.module.scss';

const Card = ({ meal }) => {
  const link = `meals/${meal.id}`;
  const start = meal.startTime.toString().replace(/T/, ' ').replace(/\..+/, '');
  const end = meal.endTime.toString().replace(/T/, ' ').replace(/\..+/, '');

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          className={styles.image}
          src="https://discovernative.org/wp-content/uploads/2020/05/food.jpg"
          alt=""
        />
        <Link href={link}>
          <a className={styles.button}>Bővebben</a>
        </Link>
      </div>

      <div className={styles.alwaysVisible}>
        <Link href={link}>
          <a className={styles.title}>{meal.name}</a>
        </Link>
        <p>{meal.price} lei</p>
      </div>

      <div className={styles.sometimesVisible}>
        <ul className={styles.moreInformation}>
          <li>Adagok: {meal.portionNumber}</li>
          <li>
            Elérhető: {start} - {end}
          </li>
          {meal?.donateable && <li>Adományozható</li>}
          {meal?.dailyMenu && <li>Napi menü</li>}
        </ul>
      </div>
    </div>
  );
};

export default Card;
