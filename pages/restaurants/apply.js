import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  Alert,
  Form,
  FormInput,
  FormGroup,
  Button,
  FormFeedback,
  CardBody,
  CardTitle,
  FormTextarea,
} from 'shards-react';
import { yupResolver } from '@hookform/resolvers/yup';
import Router from 'next/router';
import FormCard from '../../components/formCard';
import restaurantApplicationSchema from '../../validation/restaurantApplicationSchema';
import Layout from '../../components/layout';

const Apply = () => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(restaurantApplicationSchema),
  });
  const onSubmit = async (data) => {
    setAlertVisible(false);

    const res = await fetch('/api/restaurants/applications', {
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

    toast.success('A kérésedet rögzítettük. Hamarosan kapcsolatba lépünk veled.', {
      duration: 5000,
    });
    Router.push('/');
  };

  return (
    <Layout>
      <FormCard>
        <CardBody>
          <CardTitle>Vendéglátó helyiség regisztrálása</CardTitle>

          <Alert
            className="mb-3"
            dismissible={() => setAlertVisible(false)}
            open={isAlertVisible}
            theme="danger"
          >
            {alertMessage}
          </Alert>

          <p>
            Kérlek adj meg egy pár adatot a vállalkozásodról, hogy felvehessük veled a kapcsolatot!
          </p>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <label htmlFor="name">Vendéglő neve</label>
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
              <label htmlFor="email">Email-cím</label>
              <FormInput
                id="email"
                name="email"
                placeholder="Email-cím"
                innerRef={register}
                invalid={!!errors?.email}
              />
              <FormFeedback>{errors?.email?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="phone">Telefonszám</label>
              <FormInput
                id="phone"
                name="phone"
                placeholder="Telefonszám"
                innerRef={register}
                invalid={!!errors?.phone}
              />
              <FormFeedback>{errors?.phone?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="description">Mesélj röviden a vállalkozásodról!</label>
              <FormTextarea
                type="text"
                name="description"
                id="description"
                placeholder="Rövid leírás"
                innerRef={register}
                invalid={!!errors?.description}
              />
              <FormFeedback>{errors?.description?.message}</FormFeedback>
              <small className="text-muted">
                Ez a leírás nem fog megjelenni az oldalon, azért szükséges, hogy jobban megismerjünk
                egy partnert, mielőtt felvesszük vele a kapcsolatot.
              </small>
            </FormGroup>

            <Button type="submit">Regisztráció</Button>
          </Form>
        </CardBody>
      </FormCard>
    </Layout>
  );
};

export default Apply;
