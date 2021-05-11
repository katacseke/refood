import * as Yup from 'yup';

const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

export default Yup.object({
  name: Yup.string(),
  email: Yup.string().email('Az e-mail cím formátuma nem megfelelő.'),
  phone: Yup.string().matches(phoneRegex, 'A telefonszám formátuma nem megfelelő.'),
  url: Yup.string(),
  description: Yup.string(),
  address: Yup.string(),
  loginEmail: Yup.string().email('Az e-mail cím formátuma nem megfelelő.'),
  password: Yup.string()
    .transform((password) => (!password ? undefined : password))
    .min(8, 'A jelszónak legalább 8 karaktert kell tartalmaznia.')
    .matches(
      regex,
      'A jelszónak tartalmaznia kell legalább egy számot, egy nagy-, és egy kisbetűt.'
    ),
  image: Yup.mixed(),
});
