import { useContext } from 'react';
import toast from 'react-hot-toast';
import { Card, CardBody, CardTitle } from 'shards-react';
import { IoLockClosedSharp, IoMail, IoPerson, IoPhonePortraitSharp } from 'react-icons/io5';
import axios from 'axios';

import userService from '@services/userService';
import userUpdateSchema from '@validation/userUpdateSchema';
import withAuthSSR from '@middleware/withAuthSSR';

import AuthContext from '@context/authContext';
import Layout from '@components/layout';
import UserUpdateItem from '@components/userUpdateItem';

const EditPage = ({ user }) => {
  const { refreshToken } = useContext(AuthContext);
  const handleUpdate = async (name, value) => {
    try {
      await userUpdateSchema.validate({ [name]: value });
    } catch (err) {
      return err.message;
    }

    try {
      await axios.patch(`/api/users/${user.id}`, { [name]: value });
      await refreshToken();
      toast.success('Adat módosítása sikeres!');
    } catch (err) {
      const body = err.response.data;
      if (body.error || body.general) {
        toast.error(body.error || body.general.message);
      }

      if (body[name]) {
        return body[name].message;
      }
    }

    return null;
  };

  return (
    <Layout>
      <Card>
        <CardBody>
          <CardTitle>Saját profil</CardTitle>
          <UserUpdateItem
            initialValue={user.name}
            name="name"
            onUpdate={handleUpdate}
            icon={<IoPerson />}
          />

          <UserUpdateItem
            initialValue={user.email}
            name="email"
            onUpdate={handleUpdate}
            icon={<IoMail />}
          />

          <UserUpdateItem
            initialValue={user.phone}
            name="phone"
            onUpdate={handleUpdate}
            icon={<IoPhonePortraitSharp />}
          />

          <UserUpdateItem
            initialValue="........"
            name="password"
            onUpdate={handleUpdate}
            icon={<IoLockClosedSharp />}
          />
        </CardBody>
      </Card>
    </Layout>
  );
};

export default EditPage;

export const getServerSideProps = withAuthSSR(async ({ user }) => {
  try {
    const userModel = await userService.getUserById(user.id);
    return {
      props: {
        user: JSON.parse(JSON.stringify(userModel)),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
});
