const validateResource = (resourceSchema, onError) => async (req, res, next) => {
  const resource = req.body;

  try {
    // throws error if not valid
    await resourceSchema.validate(resource);
    next();
  } catch (e) {
    onError(req, res);
    res.status(422).json(e.errors);
  }
};

export default validateResource;
