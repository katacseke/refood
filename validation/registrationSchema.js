import * as Yup from 'yup';

const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

export default Yup.object({
  name: Yup.string()
    .min(2, 'A név minimum két karakter kell legyen')
    .required('A név megadása kötelező!'),
  email: Yup.string()
    .email('Az email formátuma nem megfelelő!')
    .required('Emailcím megadása kötelező!'),
  password: Yup.string()
    .min(8, 'A jelszónak legalább 8 karaktert kell tartalmaznia')
    .matches(
      regex,
      'A jelszónak tartalmaznia kell legalább egy számot, egy nagy-, és egy kisbetűt!'
    )
    .required('Jelszó megadása kötelező!'),
});
