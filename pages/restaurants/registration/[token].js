import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import toast from 'react-hot-toast';
import FormCard from '../../../components/formCard';
import restaurantCreationSchema from '../../../validation/restaurantCreationSchema';
import Layout from '../../../components/layout';
import { restaurantService } from '../../../server/services';

const RestaurantRegistration = ({ application, token }) => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(restaurantCreationSchema),
  });

  const onSubmit = async (data) => {
    setAlertVisible(false);

    const res = await fetch(`/api/restaurants/registration/${token}`, {
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

    toast.success('Sikeres regisztráció! Mostmár bejelntkezhetsz a vendéglő felhasználójával!', {
      duration: 5000,
    });
    Router.push('/');
  };

  return (
    <Layout>
      <FormCard>
        <CardBody>
          <CardTitle tag="h3">Vendéglátó helyiség regisztrálása</CardTitle>

          <Alert
            className="mb-3"
            dismissible={() => setAlertVisible(false)}
            open={isAlertVisible}
            theme="danger"
          >
            {alertMessage}
          </Alert>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <h4>Vendéglő nyilvános adatai</h4>

            <FormGroup>
              <label htmlFor="name">Vendéglő neve</label>
              <FormInput
                id="name"
                name="name"
                defaultValue={application.name}
                innerRef={register}
                invalid={!!errors?.name}
              />
              <FormFeedback>{errors?.name?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="email">Nyilvános e-mail cím</label>
              <FormInput
                id="email"
                name="email"
                defaultValue={application.email}
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
                defaultValue={application.phone}
                innerRef={register}
                invalid={!!errors?.phone}
              />
              <FormFeedback>{errors?.phone?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="address">Cím</label>
              <FormInput
                id="address"
                name="address"
                placeholder="Cím"
                innerRef={register}
                invalid={!!errors?.address}
              />
              <FormFeedback>{errors?.address?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="url">Weboldal</label>
              <FormInput
                id="url"
                name="url"
                placeholder="Weboldal"
                innerRef={register}
                invalid={!!errors?.url}
              />
              <FormFeedback>{errors?.url?.message}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <label htmlFor="description">Rövid leírás</label>
              <FormTextarea
                type="text"
                name="description"
                id="description"
                placeholder="Rövid leírás"
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
                defaultValue={application.email}
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
                placeholder="Jelszó"
                innerRef={register}
                invalid={!!errors?.password}
              />
              <FormFeedback>{errors?.password?.message}</FormFeedback>
            </FormGroup>

            <Button type="submit">Vendéglő létrehozása</Button>
          </Form>
        </CardBody>
      </FormCard>
    </Layout>
  );
};

export default RestaurantRegistration;

export async function getServerSideProps({ res, params }) {
  const { token } = params;
  const application = await restaurantService.getAcceptedApplicationByToken(token);

  if (!application.success) {
    res.writeHead(302, { Location: '/404' });
    res.end();
  }

  return {
    props: { token, application: JSON.parse(JSON.stringify(application.data)) },
  };
}
