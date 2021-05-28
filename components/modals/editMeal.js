import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import {
  Button,
  Form,
  FormGroup,
  FormFeedback,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'shards-react';
import moment from 'moment';

import mealUpdateSchema from '@validation/mealUpdateSchema';
import objectToFormData from '@helpers/objectToFormData';
import Togllebox from '@components/togglebox';
import ChipInput from '@components/chipInput';
import styles from './modal.module.scss';

const EditMeal = ({ meal, onChange }) => {
  const router = useRouter();
  const { register, handleSubmit, errors, setError, control } = useForm({
    resolver: yupResolver(mealUpdateSchema),
    defaultValues: {
      ...meal,
      image: '',
      startTime: moment(meal.startTime).format('YYYY-MM-DDTHH:mm:ss'),
      endTime: moment(meal.endTime).format('YYYY-MM-DDTHH:mm:ss'),
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = objectToFormData({
        ...data,
        image: data.image.length === 0 ? null : data.image,
      });
      const promise = axios.patch(`/api/meals/${meal.id}`, formData);

      await toast.promise(
        promise,
        {
          loading: 'Frissítés folyamatban...',
          success: 'Étel sikeresen frissítve!',
          error: (err) =>
            err.response.data.error ||
            err.response.data.general ||
            'Nem sikerült frissíteni az ételt!',
        },
        { style: { minWidth: '18rem' } }
      );

      onChange();
      router.push(router.pathname);
    } catch (err) {
      Object.keys(err.response.data)
        .filter((field) => field !== 'general' && field !== 'error')
        .forEach((field) => setError(field, { message: err.response.data[field].message }));
    }
  };

  return (
    <div className={styles.content}>
      <h4>Étel adatainak frissítése</h4>

      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
        <FormGroup>
          <label htmlFor="name">Név</label>
          <FormInput
            id="name"
            name="name"
            placeholder="Név"
            innerRef={register}
            invalid={!!errors?.name}
          />
          <FormFeedback>{errors?.name?.message}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <label htmlFor="portionNumber">Adagok száma</label>
          <FormInput
            type="number"
            name="portionNumber"
            id="portionNumber"
            placeholder="Adagok száma"
            innerRef={register}
            invalid={!!errors?.portionNumber}
          />
          <FormFeedback>{errors?.portionNumber?.message}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <label htmlFor="price">Ár</label>
          <InputGroup className="mb-2">
            <FormInput
              name="price"
              id="price"
              innerRef={register}
              invalid={!!errors?.price}
              type="number"
              step="0.01"
              placeholder="Ár"
            />
            <InputGroupAddon type="append">
              <InputGroupText>RON</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FormFeedback>{errors?.price?.message}</FormFeedback>
        </FormGroup>

        <div className="row">
          <FormGroup className="col">
            <label htmlFor="portionNumber">Ajánlat kezdete</label>
            <FormInput
              type="datetime-local"
              name="startTime"
              id="startTime"
              placeholder="Ajánlat kezdete"
              innerRef={register}
              invalid={!!errors?.startTime}
            />
            <FormFeedback>{errors?.startTime?.message}</FormFeedback>
          </FormGroup>
          <FormGroup className="col">
            <label htmlFor="portionNumber">Ajánlat vége</label>
            <FormInput
              type="datetime-local"
              name="endTime"
              id="endTime"
              placeholder="Ajánlat vége"
              innerRef={register}
              invalid={!!errors?.endTime}
            />
            <FormFeedback>{errors?.endTime?.message}</FormFeedback>
          </FormGroup>
        </div>

        <FormGroup>
          <label className="d-block">Tagek</label>
          <ChipInput name="tags" placeholder="Tag hozzáadása..." control={control} />
        </FormGroup>

        <FormGroup>
          <label className="d-block">Kép</label>
          <FormInput type="file" name="image" innerRef={register} invalid={!!errors?.image} />
          <FormFeedback>{errors?.image?.message}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <label className="d-block">Egyéb tulajdonságok</label>
          <Togllebox name="dailyMenu" innerRef={register}>
            Napi menü
          </Togllebox>
          <Togllebox name="donatable" innerRef={register}>
            Adományozható
          </Togllebox>
        </FormGroup>

        <Button type="submit" className="ml-auto mr-0">
          Módosítás
        </Button>
      </Form>
    </div>
  );
};

export default EditMeal;
