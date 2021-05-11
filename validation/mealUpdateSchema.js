import * as Yup from 'yup';

export default Yup.object({
  name: Yup.string(),
  portionNumber: Yup.number().positive('Az adagok száma pozitív kell legyen.'),
  restaurantId: Yup.string(),
  startTime: Yup.date().min(new Date(), 'Az ajánlat kezdési ideje egy jövőbeli dátum kell legyen.'),
  endTime: Yup.date().min(
    Yup.ref('startTime'),
    'A lejárati dátum a kezdési dátum után kell legyen.'
  ),
  price: Yup.number().positive('Az ár pozitív szám kell legyen.'),
  donatable: Yup.boolean(),
  dailyMenu: Yup.boolean(),
});
