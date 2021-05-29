import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDb from '@server/db';
import User from '@server/models/user';
import { AuthenticationError, NotFoundError, ValidationError } from '@services/errors';

const saltRounds = 10;

/**
 * Get user ids.
 *
 * @returns {Array<String>} Array of user ids.
 */
const getUserIds = async () => {
  await connectDb();

  const users = await User.find({}).select('_id').exec();

  return users.map((user) => user.id.toString());
};

/**
 * Get user by id.
 *
 * @param {String} id
 * @returns {Object} Returns the user instance.
 *
 * @throws {NotFoundError} Throws NotFoundError if no user with the respective
 *  id was found.
 */
const getUserById = async (id) => {
  await connectDb();

  const user = await User.findById(id).exec();

  if (!user) {
    throw new NotFoundError('Nem található felhasználó ezzel az azonosítóval.');
  }
  return { ...user.toObject(), password: undefined };
};

/**
 * Get user by email.
 *
 * @param {String} email
 * @returns {Object} Returns an object containing the User instance.
 *
 * @throws {NotFoundError} Throws NotFoundError if no user with the respective
 *  email was found.
 */
const getUserByEmail = async (email) => {
  await connectDb();

  const user = await User.findOne({ email }).exec();

  if (!user) {
    throw new NotFoundError('Nem található felhasználó ezzel az e-mail címmel.');
  }
  return user.toObject();
};

/**
 * Get user by restaurant id.
 *
 * @param {String} id The restaurant id.
 * @returns {Object} Returns an object containing the user instance.
 *
 * @throws {NotFoundError} Throws NotFoundError if no user with the respective
 *  restaurant id was found.
 */
const getUserByRestaurantId = async (restaurantId) => {
  await connectDb();

  const user = await User.findOne({ restaurantId }).exec();

  if (!user) {
    throw new NotFoundError('Nem található felhasználó ezzel a vendéglő azonosítóval.');
  }
  return user.toObject();
};

/**
 * Get all users.
 *
 * @returns {Array<Object>} Array of all users.
 */
const getUsers = async () => {
  await connectDb();

  const users = await User.find({}).exec();

  return users.map((user) => user.toObject());
};

/**
 * Insert user.
 *
 * @param {Object} user
 * @param {String} role The role of the user (admin, restaurant, user).
 * @returns {Object} Returns an object with the inserted user instance.
 *
 * @throws {ValidationError} Throws Error if a user with the same e-mail
 *                           address if already registered.
 */
const createUser = async (user, role = 'user') => {
  await connectDb();

  try {
    const hash = await bcrypt.hash(user.password, saltRounds);
    const createdUser = await User.create({ ...user, password: hash, role });
    return createdUser.toObject();
  } catch (err) {
    // Duplication error
    if (err.code === 11000) {
      throw new ValidationError('Ez az e-mail cím már létezik a rendszerben!', 'email');
    } else {
      throw err;
    }
  }
};

/**
 * Update user.
 *
 * @param {Object} user
 * @param {String} id
 * @returns {Object} Returns an object with the updated user instance.
 *
 * @throws {Error} Throws Error if the update failed.
 */
const updateUser = async (id, userData) => {
  await connectDb();

  const user = Object.fromEntries(
    Object.entries(userData).filter(([, value]) => value !== undefined)
  );

  if (user.password) {
    const hash = await bcrypt.hash(userData.password, saltRounds);
    user.password = hash;
  }

  const updatedUser = await User.findByIdAndUpdate(id, user, { new: true }).exec();

  if (!updatedUser) {
    throw new Error('Nem sikerült frissíteni a felhasználó adatait.');
  }

  return { ...updatedUser.toObject(), password: undefined };
};

/**
 * Delete user.
 *
 * @param {String} id
 */
const deleteUser = async (id) => {
  await connectDb();

  await User.findByIdAndDelete(id).exec();
};

/**
 * Check user password.
 *
 * @param {String} email Email from login form.
 * @param {String} password Password from login form.
 * @returns {Object} Returns an object with user data.
 *
 * @throws {AuthenticationError} Throws AuthenticationError if the
 * credentials are wrong.
 */
const checkCredentials = async (email, password) => {
  const user = await getUserByEmail(email);

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new AuthenticationError('Az email és jelszó páros nem talál!');
  }

  return user;
};

/**
 * Generate JWT token.
 *
 * @param {String} userId The id of the user.
 * @returns {String} The JWT token.
 *
 * @throws {NotFoundError} Throws NotFoundError if no user with the respective
 *  id was found.
 */
const createToken = async (userId) => {
  const user = await getUserById(userId);
  const { id, name, email, phone, role, restaurantId } = user;
  const claims = { id, name, email, phone, role, restaurantId };

  return jwt.sign(claims, process.env.SECRET, { expiresIn: '1h' });
};

/**
 * Verify JWT token.
 *
 * @param {String} token
 * @returns {Object} Returns the user instance extracted from the token.
 *
 * @throws {AuthenticationError} Throws AuthenticationError if the JWT token is not valid.
 */
const verifyToken = (token) => {
  try {
    const user = jwt.verify(token, process.env.SECRET);

    return user;
  } catch (err) {
    throw new AuthenticationError(err.message);
  }
};

export default {
  getUserIds,
  getUserByEmail,
  getUserByRestaurantId,
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  checkCredentials,
  createToken,
  verifyToken,
};
