import React, { useEffect } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import axios from 'axios';
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
import moment from 'moment';
import 'twix';

import restaurantUpdateSchema from '@validation/restaurantUpdateSchema';
import objectToFormData from '@helpers/objectToFormData';
import styles from './modal.module.scss';

moment.locale('hu');

const RestaurantModal = ({ restaurant, open, setOpen }) => {
  useEffect(() => {
    document.body.classList.toggle('modal-open', open);
  }, [open]);

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(restaurantUpdateSchema),
    defaultValues: { ...(restaurant ?? {}), image: '' },
  });

  const onSubmit = async (data) => {
    const formData = objectToFormData({
      ...data,
      image: data.image.length === 0 ? null : data.image,
    });

    try {
      const promise = axios.patch(`/api/restaurants/${restaurant?.id}`, formData);

      await toast.promise(
        promise,
        {
          loading: 'Vendéglő adatainak frissítése...',
          success: 'Adatok sikeresen módosítva!',
          error: (err) =>
            err.response.data.error ||
            err.response.data.general.message ||
            'A vendéglő adatainak frissítése sikertelen!',
        },
        { style: { minWidth: '18rem' } }
      );

      setOpen(false);
      Router.replace(`/restaurants/${restaurant?.id}`);
    } catch (err) {
      Object.keys(err.response.data)
        .filter((field) => field !== 'general')
        .forEach((field) => setError(field, { message: err.response.data[field].message }));
    }
  };

  if (!restaurant) {
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
              <label htmlFor="image">Kép</label>
              <FormInput type="file" name="image" innerRef={register} invalid={!!errors?.image} />
              <FormFeedback>{errors?.image?.message}</FormFeedback>
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
