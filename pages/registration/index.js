import React, { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Form,
  FormInput,
  FormGroup,
  Button,
  FormFeedback,
  Card,
  CardBody,
  CardTitle,
} from 'shards-react';
import { yupResolver } from '@hookform/resolvers/yup';
import registrationSchema from '../../validation/registrationSchema';
import { Layout } from '../../components';
import styles from './registration.module.scss';

const Registration = () => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(registrationSchema),
  });
  const onSubmit = async (data) => {
    setAlertVisible(false);

    const res = await fetch('/api/users', {
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
          <CardTitle>Regisztráció</CardTitle>
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
              <label htmlFor="password">Jelszó</label>
              <FormInput
                type="password"
                name="password"
                id="password"
                placeholder="Jelszó"
                innerRef={register}
                invalid={!!errors?.password}
              />
              <FormFeedback>{errors?.name?.message}</FormFeedback>
            </FormGroup>
            <Button type="submit">Regisztráció</Button>
          </Form>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default Registration;
