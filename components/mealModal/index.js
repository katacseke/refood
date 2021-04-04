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
} from 'shards-react';
import { IoCartOutline } from 'react-icons/io5';
import Image from 'next/image';
import { useEffect } from 'react';
import styles from './mealModal.module.scss';

const MealModal = ({ meal, open, setOpen }) => {
  useEffect(() => {
    document.body.classList.toggle('modal-open', open);
  }, [open]);

  if (!meal) {
    return <div />;
  }

  const start = meal.startTime.toString().replace(/T/, ' ').replace(/\..+/, '');
  const end = meal.endTime.toString().replace(/T/, ' ').replace(/\..+/, '');

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
          <Image
            src="https://interactive-examples.mdn.mozilla.net/media/examples/plumeria.jpg"
            alt=""
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className={styles.content}>
          <h4 className="mb-0">{meal.name}</h4>
          <p className="mb-2">Restaurant name</p>
          <h5 className="mb-2">{meal.price} lej</h5>

          <ul className={styles.moreInformation}>
            <li className={styles.mealLi}>Adagok: {meal.portionNumber}</li>
            <li className={styles.mealLi}>
              Elérhető: {start} - {end}
            </li>
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
                defaultValue="1"
                min="1"
                max={meal.portionNumber}
              />
            </Col>
            <Col>
              <Button className="col d-inline-flex align-items-center justify-content-center">
                <IoCartOutline className="mr-1" />
                Kosárba
              </Button>
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MealModal;
