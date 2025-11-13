import { config } from '../config/index.js';
import { verifyToken } from '../helper/jwt.js';
import { ApiError } from '../helper/errorMessage.js';
import {db} from '../db/knex.js'
import {pg} from "pg"

export const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, `UNAUTHORIZED, PLEASE REGISTER FIRST!`));
    }
    let token = authHeader.split(' ')[1];
     if (token.startsWith('"') && token.endsWith('"')) {
      token = token.substring(1, token.length - 1);
    }
    let validToken;
    try {
      validToken = verifyToken(token, config.jwt.accessSecret);
    } catch (err) {
      return next(new ApiError(401, `INVALID OR EXPIRED TOKEN! ${err}`));
    }
    let user;
    switch (validToken.role) {
      case 'customer':
        user = await CustomerModel.findById(validToken.id);
        if (user) user.role = 'customer'; 
        break;
      case 'staff': 
        user = await DeliveryStaffModel.findById(validToken.id);
        if (user) user.role = 'staff';     
        break;
        case 'admin':
        user = await AdminModel.findById(validToken.id);
        if (user) user.role = 'admin'; 
        break;
      default:
        return next(new ApiError(404, `NOT FOUND SUCH A USER/STAFF ID`));
    }

    if (!user) { 
        return next(new ApiError(404, `User or Staff not found for the given token.`));
    }
    req.user = user;
    
    next();
  } catch (error) {
    return next(error);
  }
};