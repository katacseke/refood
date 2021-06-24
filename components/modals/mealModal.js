import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'shards-react';
import styles from './modal.module.scss';
import DisplayMeal from './displayMeal';
import EditMeal from './editMeal';

const MealModal = ({ meal, open, toggle, onMealChange }) => {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('modal-open', open);
    setEdit(false);
  }, [open]);

  if (!meal) {
    return <div />;
  }

  return (
    <Modal centered size="md" className="modal-dialog-scrollable" open={open} toggle={toggle}>
      <ModalHeader toggle={() => toggle()} />

      <ModalBody className={styles.modalBody}>
        {edit ? (
          <EditMeal meal={meal} onTabChange={() => setEdit(!edit)} onMealChange={onMealChange} />
        ) : (
          <DisplayMeal meal={meal} toggleOpen={toggle} onTabChange={() => setEdit(!edit)} />
        )}
      </ModalBody>
    </Modal>
  );
};

export default MealModal;
