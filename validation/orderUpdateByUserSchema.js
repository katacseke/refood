import * as Yup from 'yup';

export default Yup.object({
  status: Yup.string().oneOf(['canceled'], 'Csak lemondani tudod a rendelést.'),
});
