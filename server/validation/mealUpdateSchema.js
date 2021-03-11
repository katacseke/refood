import * as Yup from 'yup';

export default Yup.object({
  name: Yup.string(),
  portionNumber: Yup.number().positive('Portion number must be positive.'),
  restaurantId: Yup.string(),
  startTime: Yup.date().min(new Date(), 'Date must be later than now.'),
  endTime: Yup.date().min(Yup.ref('startTime')),
  price: Yup.number().positive('Price must be positive.'),
  donateable: Yup.boolean(),
  dailyMenu: Yup.boolean(),
});
