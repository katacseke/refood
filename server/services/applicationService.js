import bcrypt from 'bcrypt';
import { Application } from '../models';
import connectDb from '../db';
import { NotFoundError } from './errors';

/**
 * Get application by id.
 *
 * @param {String} id
 * @returns {Object} Returns an object containing the application instance.
 *
 * @throws {NotFoundError} Throows NotFoundError when there is no application
 *                         with the given id.
 */
const getApplicationById = async (id) => {
  await connectDb();

  const application = await Application.findById(id).exec();

  if (!application) {
    throw new NotFoundError('Nem létezik jelentkezés ezzel az azonosítóval.');
  }
  return application.toObject();
};

/**
 * Get accepted application by token.
 *
 * @param {string} token
 * @returns {Object} Returns an object containing the Application instancn.
 *
 * @throws {NotFoundError} Throows NotFoundError when there is no application
 *                         with the given credentials.
 */
const getAcceptedApplicationByToken = async (token) => {
  await connectDb();

  const application = await Application.findOne({ token, status: 'accepted' }).exec();

  if (!application) {
    throw new NotFoundError('Nem létezik jelentkezés ezzel az azonosítóval.');
  }
  return application.toObject();
};

/**
 * Get all applications.
 *
 * @returns {Array<Object>} Array of all applications.
 */
const getApplications = async (status = null) => {
  await connectDb();

  const applications = await Application.find({ status }).exec();

  return applications.map((application) => application.toObject());
};

/**
 * Insert application.
 *
 * @param {Object} application
 * @returns {Object} Returns an object with created application.
 *
 * @throws {Error} Throws Error when insertion failed.
 */
const createApplication = async (application) => {
  await connectDb();

  const result = await Application.create({ ...application, status: 'pending' });

  if (!result) {
    throw new Error('Nem sikerült jelentkezni.');
  }

  return result.toObject();
};

/**
 * Update application status.
 *
 * @param {String} status
 * @param {String} id
 * @returns {Object} Returns an object with updated application.
 *
 * @throws {Error} Throws Error when update failed.
 */
const updateApplicationStatus = async (id, status) => {
  await connectDb();

  const applicationData =
    status === 'accepted' ? { status, token: await bcrypt.genSalt() } : { status };

  const result = await Application.findByIdAndUpdate(id, applicationData, { new: true }).exec();

  if (!result) {
    throw new Error('Nem sikerült frissíteni a jelentkezést.');
  }

  return result.toObject();
};

export default {
  getApplicationById,
  getAcceptedApplicationByToken,
  getApplications,
  createApplication,
  updateApplicationStatus,
};
