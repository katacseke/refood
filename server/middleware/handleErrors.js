import { AuthenticationError, NotFoundError, ValidationError } from '@services/errors';

const handleErrors = (err, req, res) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else if (err instanceof ValidationError) {
    res.status(422).json({ [err.field]: { message: err.message } });
  } else if (err instanceof AuthenticationError) {
    res.status(401).json({ error: err.message });
  } else {
    res.status(500).json({ error: err.message });
    console.err(err);
  }
};

export default handleErrors;
