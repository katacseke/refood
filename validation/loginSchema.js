import * as Yup from 'yup';

export default Yup.object({
  email: Yup.string().required('Emailcím megadása kötelező!'),
  password: Yup.string().required('Jelszó megadása kötelező!'),
});
