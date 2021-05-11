export default class NotFoundError extends Error {
  constructor(...params) {
    super(...params);

    this.name = 'NotFoundError';
  }
}
