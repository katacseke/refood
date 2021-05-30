import mongoose from 'mongoose';
import * as Yup from 'yup';

export default Yup.object({
  meal: Yup.string()
    .typeError('Az azonosító szöveg formátumú kell legyen.')
    .test('objectid', 'Nem egy ObjectId.', (meal) => mongoose.Types.ObjectId.isValid(meal))
    .required('Az étel azonosító megadása kötelező.'),
  quantity: Yup.number()
    .typeError('A mennyiségnek számnak kell lennie.')
    .integer('A mennyiség egész szám kell legyen.')
    .moreThan(-1, 'A mennyiség pozitív szám kell legyen.')
    .required('Mennyiség megadása kötelező.'),
  donation: Yup.boolean(),
});
