import * as Yup from 'yup';

const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

export default Yup.object({
  name: Yup.string().min(2).required('Username is required.'),
  email: Yup.string().email().required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password should have at least 8 characters.')
    .matches(regex, 'Password should contain at least one number and a letter')
    .required('Password is required.'),
});
