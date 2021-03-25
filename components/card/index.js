import React from 'react';
import Link from 'next/link';
import { IoCall, IoMail, IoLocationSharp } from 'react-icons/io5';
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
      {data?.donateable && <li className={styles.mealLi}>Adományozható</li>}
      {data?.dailyMenu && <li className={styles.mealLi}>Napi menü</li>}
    </ul>
  );
};

const RestaurantInformation = ({ data }) => (
  <ul className={styles.moreInformation}>
    <li>
      <IoCall className="mr-1" /> {data.phone}
    </li>
    <li>
      <IoMail className="mr-1" /> {data.email}
    </li>
    <li>
      <IoLocationSharp className="mr-1" /> {data.address}
    </li>
  </ul>
);

const Card = ({ data, type }) => {
  const link = `meals/${data.id}`;

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
          <a className={styles.title}>{data.name}</a>
        </Link>
        {type === 'meal' && <p>{data.price} lei</p>}
      </div>

      <div className={styles.sometimesVisible}>
        {type === 'meal' ? <MealInfromation data={data} /> : <RestaurantInformation data={data} />}
      </div>
    </div>
  );
};

export default Card;
