import * as Yup from 'yup';

const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export default Yup.object({
  name: Yup.string().required('Vendéglő név megadása kötelező.'),
  email: Yup.string()
    .email('Az e-mail cím formátuma nem megfelelő.')
    .required('E-mail cím megadása kötelező.'),
  phone: Yup.string()
    .matches(phoneRegex, 'A telefonszám formátuma nem megfelelő.')
    .required('Telefonszám megadása kötelező.'),
  description: Yup.string().required('Rövid leírás megadása kötelező.'),
});
