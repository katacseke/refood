import React, { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import {
  Alert,
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
import mealCreationSchema from '../../validation/mealCreationSchema';
import Layout from '../../components/layout';
import styles from './create.module.scss';
import Checkbox from '../../components/checkbox';
import ChipInput from '../../components/chipInput';

const CreateMealPage = () => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { register, handleSubmit, errors, setError, control } = useForm({
    resolver: yupResolver(mealCreationSchema),
  });

  const onSubmit = async (data) => {
    setAlertVisible(false);

    const res = await fetch('/api/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      Object.keys(err)
        .filter((field) => field !== 'general')
        .forEach((field) => setError(field, { message: err[field].message }));

      if (err.general) {
        setAlertMessage(err.general.message);
        setAlertVisible(true);
      }
      return;
    }

    Router.push('/');
  };

  return (
    <Layout>
      <Card className={styles.card}>
        <CardBody>
          <CardTitle>Étel létrehozása</CardTitle>
          <Alert
            className="mb-3"
            dismissible={() => setAlertVisible(false)}
            open={isAlertVisible}
            theme="danger"
          >
            {alertMessage}
          </Alert>

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
              <ChipInput name="tags" control={control} />
            </FormGroup>

            <FormGroup>
              <label className="d-block">Egyéb tulajdonságok</label>
              <Checkbox name="dailyMenu" innerRef={register}>
                Napi menü
              </Checkbox>
              <Checkbox name="donatable" innerRef={register}>
                Adományozható
              </Checkbox>
            </FormGroup>

            <Button type="submit">Feltöltés</Button>
          </Form>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default CreateMealPage;
