import React from 'react';
import Link from 'next/link';
import { IoCall, IoMail, IoLocationSharp } from 'react-icons/io5';
import styles from './card.module.scss';

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

const RestaurantCard = ({ data }) => (
  <div className={styles.card}>
    <div className={styles.imageContainer}>
      <img
        className={styles.image}
        src="https://discovernative.org/wp-content/uploads/2020/05/food.jpg"
        alt=""
      />
      <Link href={`/restaurants/${data._id}`}>
        <a className={styles.button}>Bővebben</a>
      </Link>
    </div>

    <div className={styles.alwaysVisible}>
      <Link href={`/restaurants/${data._id}`}>
        <a className={styles.title}>{data.name}</a>
      </Link>
    </div>

    <div className={styles.sometimesVisible}>
      <RestaurantInformation data={data} />
    </div>
  </div>
);

export default RestaurantCard;
