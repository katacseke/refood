import { useContext } from 'react';
import { Button } from 'shards-react';
import Router from 'next/router';
import Layout from '../components/layout';
import AuthContext from '../context/authContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <h1>Üdvözlünk {user && user.name}!</h1>
      <p className="highlightedText">
        Tudtad, hogy 2019-ben Románia 5 millió tonna ételfelesleget termelt? Most te is
        hozzájárulhatsz, hogy ez változhasson! Alkalmazásunk segítségével helyi vendéglők, kávézók
        fennmaradt termélei vásárolhatók meg!
      </p>

      <h2>Partnereket keresünk</h2>
      <p className="highlightedText">
        Vendéglő, vagy kávézótulajdonos vagy? Itt regisztrálhatod a saját vállalkozásod, hogy
        ezáltal is hozzájárulj a food waste csökkentéséhez!
      </p>
      <Button
        onClick={() => {
          Router.push('/restaurants/apply');
        }}
        className="align-self-end"
        size="lg"
      >
        Jelentkezz
      </Button>
    </Layout>
  );
};

export default Home;
