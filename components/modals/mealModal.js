import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
  Container,
  Badge,
  Button,
  FormInput,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Tooltip,
} from 'shards-react';
import { IoCartOutline } from 'react-icons/io5';
import moment from 'moment';
import 'twix';

import AuthContext from '@context/authContext';
import CartContext from '@context/cartContext';
import styles from './modal.module.scss';

moment.locale('hu');

const MealModal = ({ meal, open, setOpen }) => {
  const { user } = useContext(AuthContext);
  const { addCartItem } = useContext(CartContext);
  const [selectedPortions, setSelectedPortions] = useState(1);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('modal-open', open);
    setSelectedPortions(1);
  }, [open]);

  const handleAddToCart = async () => {
    if (selectedPortions > meal.portionNumber || selectedPortions < 1) {
      toast.error('Ez a mennyiség nem rendelhető meg!');
      return;
    }

    const cartItem = {
      meal: meal.id,
      quantity: selectedPortions,
    };

    try {
      const promise = addCartItem(cartItem);

      toast.promise(
        promise,
        {
          loading: 'Kosár frissítése...',
          success: 'Kosárba tetted!',
          error: (err) => err.error || err.general?.message || 'A kosár frissítése sikertelen!',
        },
        { style: { minWidth: '18rem' } }
      );

      setOpen(false);
    } catch (err) {}
  };

  if (!meal) {
    return <div />;
  }

  const timeRange = moment.twix(meal.startTime, meal.endTime);
  const currencyFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'RON' });

  return (
    <Modal
      centered
      size="md"
      className="modal-dialog-scrollable"
      open={open}
      toggle={() => setOpen(!open)}
    >
      <ModalHeader toggle={() => setOpen(!open)} />

      <ModalBody className={styles.modalBody}>
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
                onClick={handleAddToCart}
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
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MealModal;