import { Card } from 'shards-react';
import styles from './formCard.module.scss';

const FormCard = ({ children }) => <Card className={styles.card}>{children}</Card>;

export default FormCard;
