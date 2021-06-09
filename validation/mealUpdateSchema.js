import * as Yup from 'yup';

export default Yup.object({
  name: Yup.string(),
  portionNumber: Yup.number().positive('Az adagok száma pozitív kell legyen.'),
  startTime: Yup.date(),
  endTime: Yup.date().min(
    Yup.ref('startTime'),
    'A lejárati dátum a kezdési dátum után kell legyen.'
  ),
  price: Yup.number().positive('Az ár pozitív szám kell legyen.'),
  tags: Yup.array().of(Yup.string()),
  donatable: Yup.boolean(),
  dailyMenu: Yup.boolean(),
  image: Yup.mixed(),
});
