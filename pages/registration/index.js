import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import {
  Form,
  FormInput,
  FormGroup,
  Button,
  FormFeedback,
  Card,
  CardBody,
  CardTitle,
} from 'shards-react';

import registrationSchema from '@validation/registrationSchema';

import AuthContext from '@context/authContext';
import Layout from '@components/layout';

const Registration = () => {
  const { registration } = useContext(AuthContext);
  const router = useRouter();

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  // prefetch the home page if register will redirect there
  useEffect(() => {
    if (!router.query.next || router.query.next === '/') {
      router.prefetch('/');
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const promise = registration(data);

      await toast.promise(
        promise,
        {
          loading: 'Regisztráció folyamatban...',
          success: 'Sikeres regisztráció!',
          error: (err) =>
            err.response.data.error || err.response.data.general || 'A regisztráció sikertelen!',
        },
        { style: { minWidth: '18rem' } }
      );

      router.push(router.query.next || '/');
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
          <CardTitle>Regisztráció</CardTitle>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <label htmlFor="email">Emailcím</label>
              <FormInput
                id="email"
                name="email"
                placeholder="Emailcím"
                innerRef={register}
                invalid={!!errors?.email}
              />
              <FormFeedback>{errors?.email?.message}</FormFeedback>
            </FormGroup>
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
            <Button type="submit">Regisztráció</Button>
          </Form>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default Registration;
