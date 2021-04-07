import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  FormFeedback,
} from 'shards-react';
import { IoPerson, IoMail, IoLockClosedSharp } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { userService } from '../../server/services';
import userUpdateSchema from '../../validation/userUpdateSchema';
import Layout from '../../components/layout';
import withAuthSSR from '../../server/middleware/withAuthSSR';
import styles from './edit.module.scss';

const RestauantPage = ({ user }) => {
  const [emailState, setEmailState] = useState({
    active: false,
    value: user.email,
    error: undefined,
  });
  const [nameState, setNameState] = useState({ active: false, value: user.name });
  const [passwordState, setPasswordState] = useState({
    active: false,
    value: '..........',
    error: undefined,
  });

  const handleClick = async (name, state, setState) => {
    if (!state.active) {
      setState({ active: true, value: state.value });
      return;
    }

    try {
      await userUpdateSchema.validate({ [name]: state.value });

      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [name]: state.value }),
      });

      if (!res.ok) {
        const err = await res.json();

        if (err.general) {
          toast.error(err.general.message);
        }

        if (err[name]) {
          setState({ ...state, error: err[name].message });
        }
        return;
      }

      toast.success('Adat módosítása sikeres!');
      setState({ active: false, value: state.value });
    } catch (err) {
      setState({ ...state, error: err.message });
    }
  };

  return (
    <Layout>
      <Card className={styles.card}>
        <CardBody>
          <CardTitle>Saját profil</CardTitle>
          <InputGroup className="mb-2">
            <InputGroupAddon type="prepend">
              <InputGroupText>
                <IoPerson />
              </InputGroupText>
            </InputGroupAddon>
            <FormInput
              name="nameButton"
              value={nameState.value}
              disabled={!nameState.active}
              onChange={(e) => setNameState({ active: nameState.active, value: e.target.value })}
              invalid={!!nameState.error}
            />
            <InputGroupAddon type="append">
              <Button
                theme={nameState.active ? 'primary' : 'secondary'}
                onClick={() => handleClick('name', nameState, setNameState)}
              >
                {nameState.active ? 'Mentés' : 'Csere'}
              </Button>
            </InputGroupAddon>

            <FormFeedback>{nameState.error}</FormFeedback>
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroupAddon type="prepend">
              <InputGroupText>
                <IoMail />
              </InputGroupText>
            </InputGroupAddon>
            <FormInput
              name="email"
              value={emailState.value}
              disabled={!emailState.active}
              onChange={(e) => setEmailState({ active: emailState.active, value: e.target.value })}
              invalid={!!emailState.error}
            />
            <InputGroupAddon type="append">
              <Button
                theme={emailState.active ? 'primary' : 'secondary'}
                onClick={() => handleClick('email', emailState, setEmailState)}
              >
                {emailState.active ? 'Mentés' : 'Csere'}
              </Button>
            </InputGroupAddon>
            <FormFeedback>{emailState.error}</FormFeedback>
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroupAddon type="prepend">
              <InputGroupText>
                <IoLockClosedSharp />
              </InputGroupText>
            </InputGroupAddon>
            <FormInput
              type="password"
              name="password"
              value={passwordState.value}
              disabled={!passwordState.active}
              onChange={(e) =>
                setPasswordState({ active: passwordState.active, value: e.target.value })
              }
              invalid={!!passwordState.error}
            />
            <InputGroupAddon type="append">
              <Button
                theme={passwordState.active ? 'primary' : 'secondary'}
                onClick={() => handleClick('password', passwordState, setPasswordState)}
              >
                {passwordState.active ? 'Mentés' : 'Csere'}
              </Button>
            </InputGroupAddon>
            <FormFeedback>{passwordState.error}</FormFeedback>
          </InputGroup>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default RestauantPage;

export const getServerSideProps = withAuthSSR(async ({ user }) => {
  const userModel = await userService.getUserById(user._id);

  if (!userModel.success) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(userModel.data)),
    },
  };
});
