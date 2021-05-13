import { Button } from 'shards-react';
import Link from 'next/link';
import {
  IoCashOutline,
  IoEarthOutline,
  IoHeartOutline,
  IoLeafOutline,
  IoRestaurantOutline,
  IoWalkOutline,
} from 'react-icons/io5';
import { getImage } from '@plaiceholder/next';
import { getBase64 } from '@plaiceholder/base64';
import NavBar from '@components/navBar';
import LoadImage from '@components/loadImage';
import styles from './home.module.scss';

const Feature = ({ icon, children }) => (
  <li>
    <div className={styles.iconContainer}>{icon}</div>
    {children}
  </li>
);

const Home = ({ mainPlaceholderSrc, featurePlaceholderSrc }) => (
  <>
    <NavBar />
    <div className={styles.topContainer}>
      <LoadImage
        placeholderSrc={mainPlaceholderSrc}
        src="/hermes-rivera-Ww8eQWjMJWk-unsplash.jpg"
        alt=""
        width={5465}
        height={2285}
        layout="responsive"
      />
      <div className={styles.aboveLeft}>
        <h1 className={styles.title}>
          <strong>Éhes vagy?</strong> <br />
          Nézd meg az ajánlatainkat!
        </h1>
        <p className={styles.description}>
          Tudtad, hogy 2019-ben Románia 5 millió tonna ételfelesleget termelt? Most te is
          hozzájárulhatsz, hogy ez változhasson! Alkalmazásunk segítségével helyi vendéglők, kávézók
          fennmaradt termélei vásárolhatók meg!
        </p>
        <Link href="/meals">
          <Button tag="a" className={styles.forwardButton} size="lg">
            Tovább
          </Button>
        </Link>
      </div>
    </div>

    <div className={styles.centerContainer}>
      <LoadImage
        placeholderSrc={featurePlaceholderSrc}
        src="/vegleges.jpg"
        alt=""
        width={2400}
        height={1000}
        layout="responsive"
      />
      <ul className={styles.featureGrid}>
        <Feature icon={<IoEarthOutline />}> Ételpazarlás-csökkentés </Feature>
        <Feature icon={<IoCashOutline />}> Pénz megtakarítás </Feature>
        <Feature icon={<IoLeafOutline />}> Kisebb ökológiai lábnyom </Feature>
        <Feature icon={<IoRestaurantOutline />}> Finom falatok </Feature>
        <Feature icon={<IoWalkOutline />}> Személyes átvétel </Feature>
        <Feature icon={<IoHeartOutline />}> Adományozás </Feature>
      </ul>
    </div>

    <div className={styles.joinContainer}>
      <img src="/join.svg" alt="" />
      <div className={styles.textbox}>
        <h1 className={styles.title}>
          <strong>Partnereket keresünk</strong>
        </h1>
        <p className="lead">
          Vendéglő, vagy kávézótulajdonos vagy? Itt regisztrálhatod a saját vállalkozásod, hogy
          ezáltal is hozzájárulj a food waste csökkentéséhez!
        </p>

        <Link href="/restaurants/apply">
          <Button tag="a" className="align-self-start mt-2" size="lg">
            Jelentkezz
          </Button>
        </Link>
      </div>
    </div>
  </>
);

export default Home;

export async function getStaticProps() {
  const mainImg = await getImage('/hermes-rivera-Ww8eQWjMJWk-unsplash.jpg');
  const featureImg = await getImage('/vegleges.jpg');

  const mainPlaceholderSrc = await getBase64(mainImg);
  const featurePlaceholderSrc = await getBase64(featureImg);

  return {
    props: {
      mainPlaceholderSrc,
      featurePlaceholderSrc,
    },
  };
}
