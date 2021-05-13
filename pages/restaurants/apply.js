import React from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Form,
  FormInput,
  FormGroup,
  Button,
  FormFeedback,
  CardBody,
  CardTitle,
  FormTextarea,
} from 'shards-react';

import restaurantApplicationSchema from '@validation/restaurantApplicationSchema';

import FormCard from '@components/formCard';
import Layout from '@components/layout';

const Apply = () => {
  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(restaurantApplicationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const promise = axios.post('/api/restaurants/applications', data);

      await toast.promise(
        promise,
        {
          loading: 'Jelentkezés köldése folyamatban...',
          success: 'A jekentkezésedet rögzítettük. Hamarosan kapcsolatba lépünk veled.',
          error: (err) =>
            err.response.data.error || err.response.data.general || 'A jelentkezés sikertelen!',
        },
        { style: { minWidth: '18rem' } }
      );

      Router.push('/');
    } catch (err) {
      Object.keys(err.response.data)
        .filter((field) => field !== 'general')
        .forEach((field) => setError(field, { message: err.response.data[field].message }));
    }
  };

  return (
    <Layout>
      <FormCard>
        <CardBody>
          <CardTitle>Vendéglátó helyiség regisztrálása</CardTitle>

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
