/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { User } from '@server/models';
import { NotFoundError } from '@server/services/errors';
import userService from '@services/userService';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('getUserIds', () => {
  it('should return ids', async () => {
    const fakeUsers = [new User({}), new User({})];

    sinon.stub(User, 'find').returns({
      select: sinon.stub().returnsThis(),
      exec: sinon.stub().returns(fakeUsers),
    });

    const result = await userService.getUserIds();

    expect(result).to.be.an('array').and.to.have.lengthOf(2);
    expect(result[0]).to.be.a('string');
  });
});

describe('getUserById', () => {
  it('should return the user with the specified id if exists', async () => {
    const fakeUser = new User({ name: 'Tom' });

    sinon.stub(User, 'findById').returns({
      exec: sinon.stub().returns(fakeUser),
    });

    const result = await userService.getUserById('12');

    expect(result).to.be.an('object').and.include({ name: 'Tom' });
  });

  it('should throw error if the user does not exist', async () => {
    sinon.stub(User, 'findById').returns({
      exec: sinon.stub().resolves(null),
    });

    await expect(userService.getUserById('12')).to.be.rejectedWith(NotFoundError);
  });
});

describe('getUserByEmail', () => {
  const fakeUser = new User({ name: 'Tom' });

  it('should return the user with the specified email if exists', async () => {
    sinon.stub(User, 'findOne').returns({
      exec: sinon.stub().returns(fakeUser),
    });

    const result = await userService.getUserByEmail('email');

    expect(result).to.be.an('object').and.include({ name: 'Tom' });
  });

  it('should throw error if the user does not exist', async () => {
    sinon.stub(User, 'findOne').returns({
      exec: sinon.stub().returns(null),
    });

    await expect(userService.getUserByEmail('email')).to.be.rejectedWith(NotFoundError);
  });
});

describe('getUserByRestaurantId', () => {
  const fakeUser = new User({ name: 'Tom' });

  it('should return the user with the specified restaurantId if exists', async () => {
    sinon.stub(User, 'findOne').returns({
      exec: sinon.stub().returns(fakeUser),
    });

    const result = await userService.getUserByRestaurantId('email');

    expect(result).to.be.an('object').and.include({ name: 'Tom' });
  });

  it('should throw error if the user does not exist', async () => {
    sinon.stub(User, 'findOne').returns({
      exec: sinon.stub().returns(null),
    });

    await expect(userService.getUserByRestaurantId('email')).to.be.rejectedWith(NotFoundError);
  });
});

describe('getUsers', () => {
  it('should return the users', async () => {
    const fakeUsers = [new User({ name: 'Tom' }), new User({ name: 'Blair' })];

    sinon.stub(User, 'find').returns({
      exec: sinon.stub().returns(fakeUsers),
    });

    const result = await userService.getUsers();

    expect(result).to.be.an('array').and.to.have.lengthOf(2);

    expect(result[0]).to.be.an('object');
  });
});

describe('deleteRestaurant', () => {
  it('should not return error', async () => {
    const deleted = sinon.stub(User, 'findByIdAndDelete').returns({
      exec: sinon.stub().resolves(null),
    });

    await userService.deleteUser('123');
    expect(deleted.calledWith('123')).to.be.true;
  });
});
