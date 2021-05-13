import Image from 'next/image';
import styles from './loadImage.module.scss';

const LoadImage = ({ placeholderSrc, ...props }) => (
  <div>
    <img aria-hidden="true" alt="" src={placeholderSrc} className={styles.placeholder} />
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Image {...props} />
  </div>
);

export default LoadImage;
