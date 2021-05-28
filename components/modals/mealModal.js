import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal, ModalBody, ModalHeader } from 'shards-react';
import axios from 'axios';

import CartContext from '@context/cartContext';
import { useRouter } from 'next/router';
import styles from './modal.module.scss';
import DisplayMeal from './displayMeal';
import EditMeal from './editMeal';

const MealModal = ({ meal, open, setOpen }) => {
  const router = useRouter();
  const { addCartItem } = useContext(CartContext);
  const [selectedPortions, setSelectedPortions] = useState(1);
  const [edit, setEdit] = useState(false);

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
          error: (err) =>
            err.response.data.error ||
            err.response.data.general?.message ||
            'A kosár frissítése sikertelen!',
        },
        { style: { minWidth: '18rem' } }
      );

      setOpen(false);
    } catch (err) {}
  };

  const handleDelete = async () => {
    try {
      const promise = axios.delete(`/api/meals/${meal.id}`);

      toast.promise(
        promise,
        {
          loading: 'Étel törlése folyamatban...',
          success: 'Étel törölve!',
          error: (err) =>
            err.response.data.error ||
            err.response.data.general?.message ||
            'Étel törlése sikertelen!',
        },
        { style: { minWidth: '18rem' } }
      );

      setOpen(false);
      router.replace(router.pathname);
    } catch (err) {}
  };

  if (!meal) {
    return <div />;
  }

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
        {edit ? (
          <EditMeal meal={meal} onChange={() => setEdit(!edit)} />
        ) : (
          <DisplayMeal
            meal={meal}
            onDelete={handleDelete}
            onAddToCart={handleAddToCart}
            selectedPortions={selectedPortions}
            setSelectedPortions={setSelectedPortions}
            onChange={() => setEdit(!edit)}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

export default MealModal;
