import { verifyToken } from '../helpers/jwt.js';
import db from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';
import { config } from '../config/index.js';

export const authGuard = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(
        new ApiError(401, 'UNAUTHORIZED: Please login or register first.'),
      );
    }
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    let validToken;
    try {
      validToken = verifyToken(token, config.jwt.accessSecret);
    } catch (err) {
      return next(new ApiError(401, `INVALID OR EXPIRED TOKEN!`, err.message));
    }
    const user = await db('users')
      .select('*')
      .where({ id: validToken.id })
      .first();

    if (!user) {
      return next(new ApiError(404, 'User not found for the given token.'));
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
