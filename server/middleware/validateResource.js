const validateResource = (resourceSchema) => async (req, res, next) => {
  const resource = req.body;

  try {
    // throws error if not valid
    await resourceSchema.validate(resource);
    next();
  } catch (e) {
    res.status(422).json(e.errors);
  }
};

export default validateResource;
