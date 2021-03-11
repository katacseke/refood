import * as Yup from 'yup';

const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export default Yup.object({
  name: Yup.string().required('Restaurant name is required.'),
  email: Yup.string().email('Not a valid email address').required('Email is required.'),
  phone: Yup.string()
    .matches(phoneRegex, 'Not a valid phone number.')
    .required('Phone number is required'),
  url: Yup.string(),
  description: Yup.string(),
  address: Yup.string().required('Address is required'),
});
