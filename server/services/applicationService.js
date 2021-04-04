import bcrypt from 'bcrypt';
import { Application } from '../models';
import connectDb from '../db';

/**
 * Get application by id.
 * @param {string} id
 * @returns {
 *   success: Boolean,
 *   ?application: Application,
 *   ?error: String,
 * } Returns an object containing the Application instance or an error message
 */
const getApplicationById = async (id) => {
  await connectDb();

  const application = await Application.findById(id).exec();

  if (!application) {
    return {
      success: false,
      error: 'Application not found',
    };
  }

  return {
    success: true,
    data: application,
  };
};

/**
 * Get pending application by token.
 * @param {string} token
 * @returns {
 *   success: Boolean,
 *   ?application: Application,
 *   ?error: String,
 * } Returns an object containing the Application instance or an error message
 */
const getAcceptedApplicationByToken = async (token) => {
  await connectDb();

  const application = await Application.findOne({ token, status: 'accepted' }).exec();

  if (!application) {
    return {
      success: false,
      error: 'Application not found',
    };
  }

  return {
    success: true,
    data: application,
  };
};

/**
 * Get all applications.
 * @returns {Array} Array of all applications.
 */
const getApplications = async () => {
  await connectDb();

  const applications = await Application.find({}).exec();
  return { success: true, data: applications };
};

/**
 * Get applications with a given status.
 * @returns {Array} Array of applications that match the criteria.
 */
const getApplicationsWithStatus = async (status = null) => {
  await connectDb();

  if (status) {
    const applications = await Application.find({ status }).exec();
    return { success: true, data: applications };
  }

  const applications = await Application.find({}).exec();
  return { success: true, data: applications };
};

/**
 * Insert application.
 * @param {Application} application
 * @returns {Object} Returns an object with error message or success
 */
const createApplication = async (application) => {
  await connectDb();

  const result = await Application.create({ ...application, status: 'pending' });

  return result
    ? { success: true, data: application }
    : { success: false, error: 'Unable to insert data.' };
};

/**
 * Update application status.
 * @param {String} status
 * @param {String} id
 * @returns {Object} Returns an object with error message or success
 */
const updateApplicationStatus = async (id, status) => {
  await connectDb();

  const applicationData =
    status === 'accepted' ? { status, token: await bcrypt.genSalt() } : { status };

  const result = await Application.findByIdAndUpdate(id, applicationData, { new: true });
  return result
    ? { success: true, data: result }
    : { success: false, error: 'Unable to update data.' };
};

export default {
  getApplicationById,
  getAcceptedApplicationByToken,
  getApplications,
  getApplicationsWithStatus,
  createApplication,
  updateApplicationStatus,
};
