import * as Yup from 'yup';

const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export default Yup.object({
  name: Yup.string().required('Vendéglő név megadása kötelező'),
  email: Yup.string().email('Az email-cím nem megfelelő').required('Email-cím megadása kötelező.'),
  phone: Yup.string()
    .matches(phoneRegex, 'Nem megfelelő telefonszám formátum')
    .required('Telefonszám megadása kötelező'),
  url: Yup.string(),
  description: Yup.string(),
  address: Yup.string().required('Cím megadása kötelelző'),
});
