export default class ValidationError extends Error {
  constructor(message, field = 'general') {
    super(message);

    this.name = 'ValidationError';
    this.field = field;
  }
}
