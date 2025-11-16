import { db } from '../db/knex.js';
import { ApiError } from '../helpers/errorMessage.js';
import { generateToken, verifyToken } from '../helpers/jwt.js';
import {generateOtp} from "../helpers/otp.js"
import {mailer} from "../helpers/nodemailer.js"
import { config } from '../config/index.js';
import bcrypt from 'bcrypt';

export const AuthService = {
  async loginUserService(email, password) {
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
    const tokens = { accessToken, refreshToken };
    return { tokens };
  },

  async RegisterUserService(data) {
    const user = await db('users').where({ email: data.email }).first();
    if (user) {
      throw new ApiError(401, 'THIS USER ALREADY EXISTS');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const [newUser] = await db('users').insert(data).returning('*');
    return newUser;
  },

  async RegisterAdminService(data) {
    const user = await db('users').where({ email: data.email }).first();
    if (user) {
      throw new ApiError(401, 'THIS ADMIN ALREADY EXISTS');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const [newUser] = await db('users').insert(data).returning('*');
    return newUser;
  },

   async RegisterSuperAdminService(data) {
    const user = await db('users').where({ email: data.email }).first();
    if (user) {
      throw new ApiError(401, 'THIS SUPER ADMIN ALREADY EXISTS');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const [newUser] = await db('users').insert(data).returning('*');
    return newUser;
  },

  async verifyOtpService(data){
    const userId = await db('users').where({id: data.user_id}).first()
    if(!userId){
        throw new ApiError(404, `NOT FOUND SUCH A USER ID`)
    }

  }
};
