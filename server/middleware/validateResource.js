import fs from 'fs';

const validateResource = (resourceSchema) => async (req, res, next) => {
  const resource = req.body;

  try {
    // throws error if not valid
    await resourceSchema.validate(resource);
    next();
  } catch (e) {
    // delete the previously uploaded file if validation failed
    if (req.file?.path) {
      fs.unlink(req.file.path);
    }
    res.status(422).json({ [e.path]: { message: e.errors.join(' ') } });
  }
};

export default validateResource;
