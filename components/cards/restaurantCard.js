import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoCall, IoMail, IoLocationSharp } from 'react-icons/io5';

import styles from './customCard.module.scss';

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
      <Image
        src={data.image || '/default.svg'}
        alt=""
        width={300}
        height={300}
        layout="responsive"
        objectFit="cover"
      />
      <Link href={`/restaurants/${data.id}`}>
        <a className={styles.button}>Bővebben</a>
      </Link>
    </div>

    <div className={styles.alwaysVisible}>
      <Link href={`/restaurants/${data.id}`}>
        <a className={styles.title}>{data.name}</a>
      </Link>
    </div>

    <div className={styles.sometimesVisible}>
      <RestaurantInformation data={data} />
    </div>
  </div>
);

export default RestaurantCard;
