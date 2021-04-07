import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import connectDb from '../db';

const saltRounds = 10;

/**
 * Get user ids.
 * @returns {Array} Array of user ids.
 */
const getUserIds = async () => {
  await connectDb();

  const ids = await User.find({}).select('_id').exec();

  return ids.map((restaurant) => restaurant._id.toString());
};

/**
 * Get user by id.
 * @param {string} id
 * @returns {
 *   success: Boolean,
 *   ?user: User,
 *   ?error: String,
 * } Returns an object containing the User instance or an error message
 */
const getUserById = async (id) => {
  await connectDb();

  const user = await User.findById(id);

  if (!user) {
    return {
      success: false,
      error: 'User not found',
    };
  }

  return {
    success: true,
    data: { ...user.toObject(), password: undefined },
  };
};

/**
 * Get user by id.
 * @param {string} email
 * @returns {
 *   success: Boolean,
 *   ?user: User,
 *   ?error: String,
 * } Returns an object containing the User instance or an error message
 */
const getUserByEmail = async (email) => {
  await connectDb();

  const user = await User.findOne({ email }).exec();

  if (!user) {
    return {
      success: false,
      error: 'Ismeretlen email.',
    };
  }

  return {
    success: true,
    data: user,
  };
};

/**
 * Get all users.
 * @returns {Array} Array of all users.
 */
const getUsers = async () => {
  await connectDb();

  const users = await User.find({}).exec();
  const data = users.map((user) => ({ ...user.toObject(), password: undefined }));
  return { success: true, data };
};

/**
 * Insert user.
 * @param {User} user
 * @param {String} role The role of the user (admin, restaurant, user)
 * @returns {Object} Returns an object with error message or success
 */
const createUser = async (user, role = 'user') => {
  await connectDb();

  const hash = await bcrypt.hash(user.password, saltRounds);
  const result = await User.create({ ...user, password: hash, role });

  return result
    ? { success: true, data: { ...result.toObject(), password: undefined } }
    : { success: false, error: 'Unable to insert data.' };
};

/**
 * Update user.
 * @param {User} user
 * @param {String} id
 * @returns {Object} Returns an object with error message or success
 */
const updateUser = async (id, user) => {
  await connectDb();

  const result = await User.findByIdAndUpdate(id, user, { new: true });

  return result
    ? { success: true, data: { ...result.toObject(), password: undefined } }
    : { success: false, error: 'Unable to update data.' };
};

/**
 * Delete user.
 * @param {String} id
 * @returns {Object} Returns an object with error message or success
 */
const deleteUser = async (id) => {
  await connectDb();

  const result = await User.findByIdAndDelete(id);

  return result ? { success: true } : { success: false, error: 'Unable to delete data.' };
};

/**
 * Check user password
 * @param {String} email email from login form
 * @param {String} password password from login form
 * @returns Returns an object with error message or success and user data
 */
const checkCredentials = async (email, password) => {
  const user = await getUserByEmail(email);

  if (!user.success) {
    return {
      success: false,
      error: 'Az email és jelszó páros nem talál!',
    };
  }

  const match = await bcrypt.compare(password, user.data.password);

  return match
    ? { success: true, data: { ...user.data.toObject(), password: undefined } }
    : { success: false, error: 'Az email és jelszó páros nem talál!' };
};

/**
 * Generate jwt token
 * @param {User} user
 * @returns {String} jwt token
 */
const createToken = (user) => jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });

/**
 * Verify jwt token
 * @param {String} token
 * @returns {Object} at success: object containing user infromation
 *                   when the token does not match: error message
 */
const verifyToken = (token) => {
  try {
    const user = jwt.verify(token, process.env.SECRET);
    return {
      success: true,
      data: user,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

export default {
  getUserIds,
  getUserByEmail,
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  checkCredentials,
  createToken,
  verifyToken,
};
