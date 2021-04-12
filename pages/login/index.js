import React, { useContext, useState } from 'react';
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
import loginSchema from '../../validation/loginSchema';
import Layout from '../../components/layout';
import styles from './login.module.scss';
import AuthContext from '../../context/authContext';

const Login = () => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { login } = useContext(AuthContext);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setAlertVisible(false);

    const res = await login(data);

    if (!res.ok) {
      const err = await res.json();

      setAlertMessage(err.general.message);
      setAlertVisible(true);

      return;
    }

    Router.push('/');
  };

  return (
    <Layout>
      <Card className={styles.card}>
        <CardBody>
          <CardTitle>Lépj be!</CardTitle>
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
            <Button type="submit">Belépés</Button>
          </Form>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default Login;
