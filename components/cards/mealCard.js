import React from 'react';
import { Button } from 'shards-react';
import moment from 'moment';
import 'twix';
import Image from 'next/image';
import styles from './card.module.scss';

moment.locale('hu');

const MealInfromation = ({ data }) => {
  const timeRange = moment.twix(data.startTime, data.endTime);

  return (
    <ul className={styles.moreInformation}>
      <li className={styles.mealLi}>Adagok: {data.portionNumber}</li>
      <li className={styles.mealLi}>Elérhető: {timeRange.format()}</li>
      {data?.donatable && <li className={styles.mealLi}>Adományozható</li>}
      {data?.dailyMenu && <li className={styles.mealLi}>Napi menü</li>}
    </ul>
  );
};

const MealCard = ({ data, onClick }) => (
  <div className={styles.card}>
    <div className={styles.imageContainer}>
      <Image src={data.image || '/default.svg'} alt="" width={300} height={300} objectFit="cover" />

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
