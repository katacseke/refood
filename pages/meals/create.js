import React from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormInput,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  FormFeedback,
  Card,
  CardBody,
  CardTitle,
} from 'shards-react';
import { yupResolver } from '@hookform/resolvers/yup';

import mealCreationSchema from '@validation/mealCreationSchema';
import objectToFormData from '@helpers/objectToFormData';

import Layout from '@components/layout';
import Togllebox from '@components/togglebox';
import ChipInput from '@components/chipInput';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateMealPage = () => {
  const { register, handleSubmit, errors, setError, control } = useForm({
    resolver: yupResolver(mealCreationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = objectToFormData(data);
      const promise = axios.post('/api/meals', formData);

      await toast.promise(
        promise,
        {
          loading: 'Feltöltés folyamatban...',
          success: 'Étel sikeresen létrehozva!',
          error: (err) =>
            err.response.data.error ||
            err.response.data.general ||
            'Nem sikerült létrehozni az ételt!',
        },
        { style: { minWidth: '18rem' } }
      );

      Router.push('/meals');
    } catch (err) {
      Object.keys(err.response.data)
        .filter((field) => field !== 'general' && field !== 'error')
        .forEach((field) => setError(field, { message: err.response.data[field].message }));
    }
  };

  return (
    <Layout>
      <Card>
        <CardBody>
          <CardTitle>Étel létrehozása</CardTitle>

          <Form onSubmit={handleSubmit(onSubmit)}>
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
                  <InputGroupText>lej</InputGroupText>
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

            <Button type="submit">Feltöltés</Button>
          </Form>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default CreateMealPage;
