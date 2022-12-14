import * as Yup from 'yup';

const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

export default Yup.object({
  name: Yup.string().required('Vendéglő név megadása kötelező.'),
  email: Yup.string()
    .email('Az e-mail cím formátuma nem megfelelő.')
    .required('E-mail cím megadása kötelező.'),
  phone: Yup.string()
    .matches(phoneRegex, 'A telefonszám formátuma nem megfelelő.')
    .required('Telefonszám megadása kötelező.'),
  url: Yup.string(),
  description: Yup.string(),
  address: Yup.string().required('Cím megadása kötelelző.'),
  loginEmail: Yup.string()
    .email('Az e-mail cím formátuma nem megfelelő.')
    .required('E-mail cím megadása kötelező.'),
  password: Yup.string()
    .min(8, 'A jelszónak legalább 8 karaktert kell tartalmaznia.')
    .matches(
      regex,
      'A jelszónak tartalmaznia kell legalább egy számot, egy nagy-, és egy kisbetűt.'
    )
    .required('Jelszó megadása kötelező.'),
  image: Yup.mixed(),
});
