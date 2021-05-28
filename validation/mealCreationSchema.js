import * as Yup from 'yup';

export default Yup.object({
  name: Yup.string().required('Étel név megadása kötelező.'),
  portionNumber: Yup.number()
    .positive('Az adagok száma pozitív kell legyen.')
    .required('Az adagok számának megadása kötelező.'),
  startTime: Yup.date()
    .min(new Date(), 'Az ajánlat kezdési ideje egy jövőbeli dátum kell legyen.')
    .required('Az ajánlat kezdési idejének megadása kötelező.'),
  endTime: Yup.date()
    .min(Yup.ref('startTime'), 'A lejárati dátum a kezdési dátum után kell legyen.')
    .required('Lejárati dátum megadása kötelező.'),
  price: Yup.number()
    .positive('Az ár pozitív szám kell legyen.')
    .required('Az ár megadása kötelező.'),
  tags: Yup.array().of(Yup.string()),
  donatable: Yup.boolean(),
  dailyMenu: Yup.boolean(),
  image: Yup.mixed(),
});
