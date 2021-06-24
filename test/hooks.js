import sinon from 'sinon';

// eslint-disable-next-line import/prefer-default-export
export const mochaHooks = {
  afterEach() {
    sinon.restore();
  },
};
