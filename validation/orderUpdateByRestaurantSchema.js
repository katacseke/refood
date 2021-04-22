import * as Yup from 'yup';

export default Yup.object({
  status: Yup.string().oneOf(['denied', 'finished'], 'Ilyen rendelési státusz nem létezik.'),
});
