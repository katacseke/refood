/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import applicationService from '@services/applicationService';
import { Application } from '@server/models';
import { NotFoundError } from '@server/services/errors';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('getApplicationById', () => {
  it('should return the application with the specified id if exists', async () => {
    const fakeApplication = new Application({ name: 'Green Bistro' });

    sinon.stub(Application, 'findById').returns({
      exec: sinon.stub().resolves(fakeApplication),
    });

    const result = await applicationService.getApplicationById('12');

    expect(result).to.be.an('object').and.include({ name: 'Green Bistro' });
  });

  it('should throw error if the application does not exist', async () => {
    sinon.stub(Application, 'findById').returns({
      exec: sinon.stub().resolves(null),
    });

    await expect(applicationService.getApplicationById('12')).to.be.rejectedWith(NotFoundError);
  });
});

describe('getAcceptedApplicationByToken', () => {
  it('should return an application by its token', async () => {
    const fakeApplication = new Application({
      name: 'Green Bistro',
      status: 'accepted',
      token: '12345abc',
    });

    sinon.stub(Application, 'findOne').returns({
      exec: sinon.stub().resolves(fakeApplication),
    });

    const result = await applicationService.getAcceptedApplicationByToken('12345abc');

    expect(result).to.be.an('object').and.include({ status: 'accepted' });
  });

  it('should throw error if the application does not exist', async () => {
    sinon.stub(Application, 'findOne').returns({
      exec: sinon.stub().resolves(null),
    });

    await expect(applicationService.getAcceptedApplicationByToken('12')).to.be.rejectedWith(
      NotFoundError
    );
  });
});

describe('getApplications', () => {
  it('should return the applications', async () => {
    const fakeMeals = [
      new Application({ name: 'Green Bistro' }),
      new Application({ name: 'Pizza Place' }),
    ];

    sinon.stub(Application, 'find').returns({
      sort: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(fakeMeals),
    });

    const result = await applicationService.getApplications();

    expect(result).to.be.an('array').and.to.have.lengthOf(2);

    expect(result[0]).to.be.an('object');
  });
});

describe('createApplication', () => {
  it('should return new application object', async () => {
    const application = {
      name: 'Green Bistro',
      email: 'green@bistro.com',
      phone: '0766625088',
    };
    const fakeApplication = new Application({
      name: 'Green Bistro',
      email: 'green@bistro.com',
      phone: '0766625088',
      status: 'pending',
    });

    sinon.stub(Application, 'create').resolves(fakeApplication);

    const result = await applicationService.createApplication(application);

    expect(result).to.be.an('object');
    expect(Object.values(result)).to.include('Green Bistro').and.include('pending');
  });

  it('should throw error when creation not successful', async () => {
    const application = {
      name: 'Green Bistro',
      email: 'green@bistro.com',
      phone: '0766625088',
    };

    sinon.stub(Application, 'create').resolves(null);

    expect(applicationService.createApplication(application)).to.be.rejectedWith(Error);
  });
});
