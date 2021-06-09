/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import mealService from '@services/mealService';
import { Meal, Restaurant } from '@server/models';
import { NotFoundError } from '@server/services/errors';
import * as connectDb from '@server/db';

chai.use(chaiAsPromised);
const { expect } = chai;

beforeEach(() => {
  sinon.stub(connectDb).default.resolves(undefined);
});

afterEach(() => {
  sinon.stub(connectDb).default.restore();
});

describe('getMealById', () => {
  it('should return the meal with the specified id if exists', async () => {
    const fakeMeal = new Meal({ name: 'Cake' });

    sinon.stub(Meal, 'findOneWithDeleted').returns({
      exec: sinon.stub().returns(fakeMeal),
    });

    const result = await mealService.getMealById('12');

    expect(result).to.be.an('object').and.include({ name: 'Cake' });
  });

  it('should throw error if the meal does not exist', async () => {
    sinon.stub(Meal, 'findOneWithDeleted').returns({
      exec: sinon.stub().returns(null),
    });

    await expect(mealService.getMealById('12')).to.be.rejectedWith(NotFoundError);
  });
});

describe('getMeals', () => {
  it('should return the meals', async () => {
    const fakeMeals = [
      new Meal({ name: 'Cake', donatable: true, dailyMenu: true, portionNumber: 6 }),
      new Meal({ name: 'Salad' }),
    ];

    sinon.stub(Meal, 'find').returns({
      exec: sinon.stub().returns(fakeMeals),
    });

    const result = await mealService.getMeals();

    expect(result).to.be.an('array').and.to.have.lengthOf(2);

    expect(result[0]).to.be.an('object');
  });

  it('should return empty array when there are no meals', async () => {
    sinon.stub(Meal, 'find').returns({
      exec: sinon.stub().returns([]),
    });

    const result = await mealService.getMeals();

    await expect(result).to.be.an('array').and.to.be.empty;
  });

  it('should not filter with false boolean values', async () => {
    const fakeMeals = [
      new Meal({
        name: 'Cake',
        donatable: false,
        dailyMenu: true,
        portionNumber: 7,
        startTime: '2021-06-15T13:00:00.000+00:00',
        endTime: '2021-09-15T13:00:00.000+00:00',
        restaurantId: '604a18c3a4781a3cf9794ba9',
      }),
    ];

    const fakeFind = sinon.stub(Meal, 'find').returns({
      sort: sinon.stub().returnsThis(),
      exec: sinon.stub().returns(fakeMeals),
    });

    await mealService.getMeals({ donatable: 'false' });

    expect(fakeFind.neverCalledWithMatch((filter) => Object.keys(filter).includes('donatable'))).to
      .be.true;

    const result = await mealService.getMeals({ donatable: 'true' });

    expect(fakeFind.calledWithMatch((filter) => Object.keys(filter).includes('donatable'))).to.be
      .true;

    expect(result).to.be.an('array').and.to.have.lengthOf(1);
  });
});

describe('getMealsByRestaurant', () => {
  it('should call getMeals with additional restaurantId filter', async () => {
    const fakeMeals = [
      new Meal({
        name: 'Cake',
        donatable: false,
        dailyMenu: true,
        portionNumber: 7,
        startTime: '2021-06-15T13:00:00.000+00:00',
        endTime: '2021-09-15T13:00:00.000+00:00',
        restaurantId: '604a18c3a4781a3cf9794ba9',
      }),
    ];

    const fakeFind = sinon.stub(Meal, 'find').returns({
      sort: sinon.stub().returnsThis(),
      exec: sinon.stub().returns(fakeMeals),
    });

    const result = await mealService.getMealsByRestaurant({ donatable: 'true' });

    expect(fakeFind.calledWithMatch((filter) => Object.keys(filter).includes('restaurantId'))).to.be
      .true;

    expect(result).to.be.an('array').and.to.have.lengthOf(1);
  });
});

describe('getCurrentMeals', () => {
  it('should call getMeals with additional time filters', async () => {
    const fakeMeals = [
      new Meal({
        name: 'Cake',
        donatable: false,
        dailyMenu: true,
        portionNumber: 7,
        startTime: '2021-06-10T13:00:00.000+00:00',
        endTime: '2021-06-15T13:00:00.000+00:00',
        restaurantId: '604a18c3a4781a3cf9794ba9',
      }),
    ];

    const fakeFind = sinon.stub(Meal, 'find').returns({
      sort: sinon.stub().returnsThis(),
      exec: sinon.stub().returns(fakeMeals),
    });

    const result = await mealService.getCurrentMeals();

    expect(fakeFind.calledWithMatch((filter) => Object.keys(filter).includes('startTime'))).to.be
      .true;

    expect(result).to.be.an('array').and.to.have.lengthOf(1);
  });
});

describe('createMeal', () => {
  it('should return new meal object', async () => {
    const meal = {
      name: 'Cake',
      donatable: false,
      dailyMenu: true,
      portionNumber: 7,
      startTime: '2021-06-10T13:00:00.000+00:00',
      endTime: '2021-06-15T13:00:00.000+00:00',
      restaurantId: '604a18c3a4781a3cf9794ba9',
    };
    const restaurant = new Restaurant({
      name: 'Restaurant',
    });
    const fakeMeal = new Meal({
      name: 'Cake',
      donatable: false,
      dailyMenu: true,
      portionNumber: 7,
      startTime: '2021-06-10T13:00:00.000+00:00',
      endTime: '2021-06-15T13:00:00.000+00:00',
      restaurantId: '604a18c3a4781a3cf9794ba9',
    });

    sinon.stub(Meal, 'create').resolves(fakeMeal);
    sinon.stub(Restaurant, 'findById').returns({
      exec: sinon.stub().resolves(restaurant),
    });

    const result = await mealService.createMeal(meal);

    expect(result).to.be.an('object');
    expect(Object.values(result)).to.include('Cake').and.include(7);
  });
});

describe('updateMeal', () => {
  it('should return new meal object', async () => {
    const meal = {
      name: 'Pie',
      donatable: false,
      dailyMenu: true,
      portionNumber: 4,
      startTime: '2021-06-10T13:00:00.000+00:00',
      endTime: '2021-06-15T13:00:00.000+00:00',
      restaurantId: '604a18c3a4781a3cf9794ba9',
    };
    const newMeal = new Meal({
      name: 'Pie',
      donatable: false,
      dailyMenu: true,
      portionNumber: 4,
      startTime: '2021-06-10T13:00:00.000+00:00',
      endTime: '2021-06-15T13:00:00.000+00:00',
      restaurantId: '604a18c3a4781a3cf9794ba9',
    });

    sinon.stub(Meal, 'findByIdAndUpdate').returns({
      exec: sinon.stub().resolves(newMeal),
    });

    const result = await mealService.updateMeal('123', meal);

    expect(result).to.be.an('object');
    expect(Object.values(result)).to.include('Pie').and.include(4);
  });
});
