import  db from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';
import { generateToken, verifyToken } from '../helpers/jwt.js';
import { generateOtp } from '../helpers/otp.js';
import { mailer } from '../helpers/nodemailer.js';
import { config } from '../config/index.js';
import bcrypt from 'bcrypt';

export const AuthService = {
  
  async SignInService(email, password) {
    const user = await db('users').where({ email }).first();
    if (!user) {
      throw new ApiError(401, 'INVALID PASSWORD OR EMAIL');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new ApiError(401, 'INVALID PASSWORD OR EMAIL');
    }
    const accessPayload = { id: user.id, role: user.role, email: user.email };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );
    const refreshPayload = { id: user.id, role: user.role, email: user.email };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    return {
       user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken,
    };
  },

  async SignUpService(data) {
    return await db.transaction(async (trx) => {
      const user = await trx('users').where({ email: data.email }).first();
      if (user) {
        throw new ApiError(401, 'THIS USER ALREADY EXISTS');
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;

      const [newUser] = await trx('users').insert(data).returning('*');
      const newOtp = await trx('otps')
        .insert({ otp: generateOtp(), user_id: newUser.id })
        .returning('*');
      const email = newUser.email;
      const otp = newOtp.otp;
      await mailer(email, otp);
      return {
        message: 'User created',
        userI: newUser.id,
        otpSent: true,
      };
    });
  },

  async verifyOtpService(data) {
    return await db.transaction(async (trx) => {
      const user = await trx('users').where({ id: data.user_id }).first();
      if (!user) {
        throw new ApiError(404, `NOT FOUND SUCH A USER ID`);
      }
      const checkOtp = await trx('otps').where({
        user_id: data.user_id,
        otp: data.otp,
      });
      if (!checkOtp) {
        throw new ApiError(401, `INVALID ONE TIME PASSWORD`);
      }
      user.status = 'active';
      await trx('users').where({ id: user.id }).update(user);
      await trx('otps').where({ id: checkOtp.id }).del();
      return {
        message: 'OTP verified, account activated',
      };
    });
  },

  async profileService(userId) {
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      throw new ApiError(404, 'User not found, please register first');
    }
    delete user.password;
    return user;
  },


  async logoutService(userId) {
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      throw new ApiError(404, 'User not found, please register first');
    }
    user.status = 'inactive';
    await db('users').where({ id: user.id }).update(user);
    return { message: `LOGOUT SUCCESSFUL` };
  },


  async refreshTokenService(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(400, 'No refresh token provided');
    }
    if (refreshToken.startsWith('"') && refreshToken.endsWith('"')) {
      refreshToken = refreshToken.slice(1, -1);
    }
    let decoded;
    try {
      decoded = verifyToken(refreshToken, config.jwt.refreshSecret);
      return {
        message: 'The given token is still valid, no need to refresh',
      };
    } catch (err) {
        console.warn(err.message)
    }
    const user = await db('users').where({ id: decoded.id }).first();
    if (!user) {
      throw new ApiError(404, 'User not found or deleted');
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const newAccessToken = generateToken(
      payload,
      config.jwt.accessSecret,
      '7d',
    );
    const newRefreshToken = generateToken(
      payload,
      config.jwt.refreshSecret,
      '30d',
    );
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
  },
};
