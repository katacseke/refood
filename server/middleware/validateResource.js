import cloudinary from 'cloudinary';

/**
 * Middleware that validates the data in the request body against
 * the provided validation schema.
 * It sends a 422 response if the validation fails,
 * otherwise it passes through the request to the next handler.
 * If validation failed, and there was a file uploaded with the request,
 * it deletes that file to avoid dangling files on the server.
 *
 * @param {Yup.Schema} resourceSchema
 */
const validateResource = (resourceSchema) => async (req, res, next) => {
  try {
    // throws error if not valid
    req.body = await resourceSchema.validate(req.body, { stripUnknown: true });
    next();
  } catch (e) {
    // delete the previously uploaded file if validation failed
    if (req.file?.path) {
      cloudinary.v2.uploader.destroy(req.file.filename);
    }
    res.status(422).json({ [e.path]: { message: e.errors.join(' ') } });
  }
};

export default validateResource;
