import * as Yup from 'yup';

export default Yup.object({
  email: Yup.string().required('E-mail cím megadása kötelező.'),
  password: Yup.string().required('Jelszó megadása kötelező.'),
});
