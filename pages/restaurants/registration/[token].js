import React from 'react';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import toast from 'react-hot-toast';
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
import { yupResolver } from '@hookform/resolvers/yup';

import applicationService from '@services/applicationService';
import restaurantCreationSchema from '@validation/restaurantCreationSchema';
import objectToFormData from '@helpers/objectToFormData';

import FormCard from '@components/formCard';
import Layout from '@components/layout';
import axios from 'axios';

const RestaurantRegistration = ({ application, token }) => {
  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(restaurantCreationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = objectToFormData(data);
      const promise = axios.post(`/api/restaurants/registration/${token}`, formData);

      await toast.promise(
        promise,
        {
          loading: 'Regisztráció folyamatban...',
          success: 'Sikeres regisztráció! Mostmár bejelntkezhetsz a vendéglő felhasználójával!',
          error: (err) =>
            err.response.data.error || err.response.data.general || 'A regisztráció sikertelen!',
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
          <CardTitle tag="h3">Vendéglátó helyiség regisztrálása</CardTitle>

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
              <label className="d-block">Kép</label>
              <FormInput type="file" name="image" innerRef={register} invalid={!!errors?.image} />
              <FormFeedback>{errors?.image?.message}</FormFeedback>
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

export async function getServerSideProps({ params }) {
  const { token } = params;
  try {
    const application = await applicationService.getAcceptedApplicationByToken(token);

    return {
      props: { token, application: JSON.parse(JSON.stringify(application)) },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}
