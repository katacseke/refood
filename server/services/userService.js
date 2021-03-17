import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import connectDb from '../db';

const saltRounds = 10;

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

  user.password = undefined;
  return {
    success: true,
    data: user,
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
  return { success: true, data: { ...users, password: undefined } };
};

/**
 * Insert user.
 * @param {User} user
 * @returns {Object} Returns an object with error message or success
 */
const createUser = async (user) => {
  await connectDb();

  const data = {
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const hash = await bcrypt.hash(user.password, saltRounds);
  const result = await User.create({ ...user, password: hash, role: 'user' });

  return result ? { success: true, data } : { success: false, error: 'Unable to insert data.' };
};

/**
 * Update user.
 * @param {User} user
 * @param {String} id
 * @returns {Object} Returns an object with error message or success
 */
const updateUser = async (id, user) => {
  await connectDb();

  const data = {
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const result = await User.findByIdAndUpdate(id, user, { new: true });

  return result ? { success: true, data } : { success: false, error: 'Unable to update data.' };
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
      error: user.error,
    };
  }
  const data = {
    email: user.data.email,
    name: user.data.name,
    role: user.data.role,
  };

  const match = await bcrypt.compare(password, user.data.password);

  return match ? { success: true, data } : { success: false, error: 'Password does not match' };
};

const createToken = (user) => jwt.sign(user, process.env.SECRET, { expiresIn: '14d' });

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
