import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
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
import { yupResolver } from '@hookform/resolvers/yup';

import loginSchema from '@validation/loginSchema';
import AuthContext from '@context/authContext';

import Layout from '@components/layout';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // prefetch the home page if login will redirect there
  useEffect(() => {
    if (!router.query.next || router.query.next === '/') {
      router.prefetch('/');
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const promise = login(data);

      await toast.promise(
        promise,
        {
          loading: 'Bejelentkezés folyamatban...',
          success: 'Bejelentkezve!',
          error: (err) => err.response.data.error || err.response.data.general.message,
        },
        { style: { minWidth: '18rem' } }
      );

      router.push(router.query.next || '/');
    } catch (err) {}
  };

  return (
    <Layout>
      <Card>
        <CardBody>
          <CardTitle>Lépj be!</CardTitle>

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
