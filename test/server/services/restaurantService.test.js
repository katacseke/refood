/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import restaurantService from '@services/restaurantService';
import { Restaurant, User } from '@server/models';
import { NotFoundError } from '@server/services/errors';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('getRestaurantIds', () => {
  it('should return ids', async () => {
    const fakeRestaurants = [new Restaurant({}), new Restaurant({})];

    sinon.stub(Restaurant, 'find').returns({
      select: sinon.stub().returnsThis(),
      exec: sinon.stub().returns(fakeRestaurants),
    });

    const result = await restaurantService.getRestaurantIds();

    expect(result).to.be.an('array').and.to.have.lengthOf(2);
    expect(result[0]).to.be.a('string');
  });
});

describe('getRestaurantById', () => {
  it('should return the restaurant with the specified id if exists', async () => {
    const fakeRestaurant = new Restaurant({ name: 'Green Bistro' });

    sinon.stub(Restaurant, 'findById').returns({
      exec: sinon.stub().returns(fakeRestaurant),
    });

    const result = await restaurantService.getRestaurantById('12');

    expect(result).to.be.an('object').and.include({ name: 'Green Bistro' });
  });

  it('should throw error if the restaurant does not exist', async () => {
    sinon.stub(Restaurant, 'findById').returns({
      exec: sinon.stub().returns(null),
    });

    await expect(restaurantService.getRestaurantById('12')).to.be.rejectedWith(NotFoundError);
  });
});

describe('getRestaurantIdByOwner', () => {
  it('should return the restaurant id with the specified owner if exists', async () => {
    sinon.stub(Restaurant, 'find').returns({
      select: sinon.stub().returnsThis(),
      exec: sinon.stub().returns('1234'),
    });

    const result = await restaurantService.getRestaurantIdByOwner('12');

    expect(result).to.be.a('string').and.equal('1234');
  });

  it('should throw error if the restaurant does not exist', async () => {
    sinon.stub(Restaurant, 'find').returns({
      select: sinon.stub().returnsThis(),
      exec: sinon.stub().returns(null),
    });

    await expect(restaurantService.getRestaurantIdByOwner('12')).to.be.rejectedWith(NotFoundError);
  });
});

describe('getRestaurants', () => {
  it('should return the restaurants', async () => {
    const fakeRestaurants = [
      new Restaurant({ name: 'Green Bistro' }),
      new Restaurant({ name: 'Salad Box' }),
    ];

    sinon.stub(Restaurant, 'find').returns({
      exec: sinon.stub().returns(fakeRestaurants),
    });

    const result = await restaurantService.getRestaurants();

    expect(result).to.be.an('array').and.to.have.lengthOf(2);

    expect(result[0]).to.be.an('object');
  });
});

describe('getRestaurantsWithName', () => {
  it('should return restaurants that match name filter', async () => {
    const fakeRestaurants = [
      new Restaurant({ name: 'Salad Bistro' }),
      new Restaurant({ name: 'Salad Box' }),
    ];

    const fakeFind = sinon.stub(Restaurant, 'find').returns({
      exec: sinon.stub().returns(fakeRestaurants),
    });

    const result = await restaurantService.getRestaurantsWithName('Salad');

    expect(fakeFind.calledWithMatch((filter) => Object.keys(filter).includes('name'))).to.be.true;

    expect(result).to.be.an('array').and.to.have.lengthOf(2);
  });
});

describe.skip('createRestaurant', () => {
  it('should return new restaurant object', async () => {
    const restaurant = {
      name: 'Green',
      email: 'green@gmail.com',
      phone: '0756625988',
      url: 'fakeurl',
      description: 'This is my restaurant.',
      address: '5. Pades Street',
      loginEmail: 'green@gmail.com',
      password: 'dfggdg',
      image: '',
    };
    const fakeUser = new User({
      name: 'Green',
      email: 'green@gmail.com',
      phone: '0756625988',
    });
    const fakeRestaurant = new Restaurant({
      name: 'Green',
      email: 'green@gmail.com',
      phone: '0756625988',
      url: 'fakeurl',
      description: 'This is my restaurant.',
      address: '5. Pades Street',
      loginEmail: 'green@gmail.com',
      password: 'dfggdg',
      image: '',
    });

    sinon.stub(Restaurant, 'create').resolves(fakeRestaurant);
    sinon.stub(User, 'create').resolves(fakeUser);
    sinon.stub(Restaurant, 'findById').returns({
      exec: sinon.stub().resolves(restaurant),
    });

    const result = await restaurantService.createRestaurant(restaurant);

    expect(result).to.be.an('object');
    expect(Object.values(result)).to.include('Greeb');
  });
  it('should throw error when creation unsuccessful', async () => {
    const restaurant = {
      name: 'Green',
      email: 'green@gmail.com',
      phone: '0756625988',
      url: 'fakeurl',
      description: 'This is my restaurant.',
      address: '5. Pades Street',
      loginEmail: 'green@gmail.com',
      password: 'dfggdg',
      image: '',
    };
    const fakeUser = new User({
      name: 'Green',
      email: 'green@gmail.com',
      phone: '0756625988',
    });

    sinon.stub(Restaurant, 'create').resolves(null);
    sinon.stub(User, 'create').resolves(fakeUser);

    expect(restaurantService.createRestaurant(restaurant)).to.be.rejectedWith(Error);
  });
});
