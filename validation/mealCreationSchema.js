import * as Yup from 'yup';

export default Yup.object({
  name: Yup.string().required('Meal name is required.'),
  portionNumber: Yup.number()
    .positive('Portion number must be positive.')
    .required('Portion number is required'),
  restaurantId: Yup.string().required('Restaurant id is required.'),
  startTime: Yup.date()
    .min(new Date(), 'Date must be later than now.')
    .required('Start time is required'),
  endTime: Yup.date().min(Yup.ref('startTime')).required('End time is required'),
  price: Yup.number().positive('Price must be positive.').required('Price is required'),
  donateable: Yup.boolean(),
  dailyMenu: Yup.boolean(),
});
