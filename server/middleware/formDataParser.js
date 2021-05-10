import formDataToObject from '../../helpers/formDataToObject';

const formDataParser = (req, res, next) => {
  req.body = formDataToObject(req.body);

  if (req?.file?.path !== null) {
    req.file.path = req.file.path.replace('\\', '/').replace('public/', '/');
  }
  next();
};

export default formDataParser;
