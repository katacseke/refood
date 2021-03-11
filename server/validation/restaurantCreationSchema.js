import * as Yup from 'yup';

export default Yup.object({
  name: Yup.string().required('Restaurant name is required.'),
  email: Yup.string().email('Not a valid email address').required('Email is required.'),
  phone: Yup.string().required('Phone number is required'),
  url: Yup.string(),
  description: Yup.string(),
  address: Yup.string().required('Address is required'),
});
