import { useContext, useState } from 'react';
import Image from 'next/image';
import { Container, Badge, Button, FormInput, Row, Col, Tooltip } from 'shards-react';
import { IoCartOutline, IoSettingsOutline, IoTrashOutline } from 'react-icons/io5';
import moment from 'moment';
import 'twix';

import AuthContext from '@context/authContext';
import styles from './modal.module.scss';

moment.locale('hu');

const DisplayMeal = ({
  meal,
  onAddToCart,
  onDelete,
  selectedPortions,
  setSelectedPortions,
  onTabChange,
}) => {
  const { user } = useContext(AuthContext);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const timeRange = moment.twix(meal.startTime, meal.endTime);
  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });

  return (
    <>
      <div style={{ position: 'relative', height: '18rem' }}>
        <Image src={meal.image || '/default.svg'} alt="" layout="fill" objectFit="cover" />
      </div>

      <div className={styles.content}>
        <h4 className="mb-0">{meal.name}</h4>
        <p className="mb-2">Restaurant name</p>
        <h5 className="mb-2">{currencyFormatter.format(meal.price)}</h5>

        <ul className={styles.moreInformation}>
          <li className={styles.mealLi}>Adagok: {meal.portionNumber}</li>
          <li className={styles.mealLi}>Elérhető: {timeRange.format()}</li>
          {meal?.donatable && <li className={styles.mealLi}>Adományozható</li>}
          {meal?.dailyMenu && <li className={styles.mealLi}>Napi menü</li>}
        </ul>

        <Container className="mb-3 pl-0">
          {meal.tags.map((tag) => (
            <Badge className="mr-1" key={tag} theme="light">
              {tag}
            </Badge>
          ))}
        </Container>

        {user?.restaurantId === meal.restaurantId ? (
          <div className="d-flex">
            <Button
              theme="danger"
              title="Törlés"
              className="d-flex align-items-cente mr-1"
              onClick={onDelete}
            >
              <IoTrashOutline />
            </Button>
            <Button title="Szerkesztés" className="d-flex align-items-center" onClick={onTabChange}>
              <IoSettingsOutline />
            </Button>
          </div>
        ) : (
          <>
            <label htmlFor="quantitiy">Mennyiség</label>
            <Row>
              <Col xs="4">
                <FormInput
                  className="col"
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={selectedPortions}
                  onChange={(e) => setSelectedPortions(parseInt(e.target.value, 10))}
                  min="1"
                  max={meal.portionNumber}
                />
              </Col>
              <Col id="cartButton">
                <Button
                  onClick={onAddToCart}
                  className="col d-inline-flex align-items-center justify-content-center"
                  disabled={!user}
                >
                  <IoCartOutline className="mr-1" />
                  Kosárba
                </Button>
                {!user && (
                  <Tooltip
                    open={tooltipOpen}
                    target="#cartButton"
                    toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    Rendeléshez jelentkezz be!
                  </Tooltip>
                )}
              </Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default DisplayMeal;
