import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Form,
  FormGroup,
  FormTextarea,
  FormFeedback,
  FormInput,
  Modal,
  ModalBody,
  ModalHeader,
} from 'shards-react';
import Router from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import moment from 'moment';
import restaurantUpdateSchema from '../../validation/restaurantUpdateSchema';
import 'twix';
import styles from './restaurantModal.module.scss';

moment.locale('hu');

const RestaurantModal = ({ restaurant, open, setOpen }) => {
  useEffect(() => {
    document.body.classList.toggle('modal-open', open);
  }, [open]);

  if (!restaurant) {
    return <div />;
  }

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(restaurantUpdateSchema),
    defaultValues: restaurant,
  });

  const onSubmit = async (data) => {
    const res = await fetch(`/api/restaurants/${restaurant.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, ownerId: restaurant.ownerId }),
    });

    if (!res.ok) {
      const err = await res.json();
      Object.keys(err)
        .filter((field) => field !== 'general')
        .forEach((field) => setError(field, { message: err[field].message }));

      if (err.general) {
        toast.error(err.general.message);
      }
      return;
    }

    toast.success('Adatok sikeresen módosítva!');
    setOpen(false);
    Router.push(`/restaurants/${restaurant.id}`);
  };

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
        <div className={styles.content}>
          <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
            <h4>Vendéglő nyilvános adatai</h4>

            <FormGroup>
              <label htmlFor="name">Vendéglő neve</label>
              <FormInput id="name" name="name" innerRef={register} invalid={!!errors?.name} />
              <FormFeedback>{errors?.name?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="email">Nyilvános e-mail cím</label>
              <FormInput id="email" name="email" innerRef={register} invalid={!!errors?.email} />
              <FormFeedback>{errors?.email?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="phone">Telefonszám</label>
              <FormInput id="phone" name="phone" innerRef={register} invalid={!!errors?.phone} />
              <FormFeedback>{errors?.phone?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="address">Cím</label>
              <FormInput
                id="address"
                name="address"
                innerRef={register}
                invalid={!!errors?.address}
              />
              <FormFeedback>{errors?.address?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="url">Weboldal</label>
              <FormInput id="url" name="url" innerRef={register} invalid={!!errors?.url} />
              <FormFeedback>{errors?.url?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="description">Rövid leírás</label>
              <FormTextarea
                type="text"
                name="description"
                id="description"
                innerRef={register}
                invalid={!!errors?.description}
              />
              <FormFeedback>{errors?.description?.message}</FormFeedback>
            </FormGroup>

            <h4 className="mt-4">Bejelentkezési adatok</h4>

            <FormGroup>
              <label htmlFor="loginEmail">E-mail cím</label>
              <FormInput
                id="loginEmail"
                name="loginEmail"
                innerRef={register}
                invalid={!!errors?.loginEmail}
              />
              <FormFeedback>{errors?.loginEmail?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="password">Jelszó</label>
              <FormInput
                type="password"
                name="password"
                id="password"
                placeholder="Új jelszó"
                innerRef={register}
                invalid={!!errors?.password}
              />
              <FormFeedback>{errors?.password?.message}</FormFeedback>
            </FormGroup>

            <Button type="submit" className="ml-auto mr-0">
              Módosítás
            </Button>
          </Form>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default RestaurantModal;
