import { Router } from 'express';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import {
  createOrder,
  getAllOrders,
  getCreateOrderPage,
  getOrderById,
} from '../controllers/order.controller.js';
import { validate } from '../middleware/validate.js';
import { orderValidate } from '../validations/order.validation.js';

export const OrderRouter = Router();
OrderRouter.get(
  '/',
  authGuard,
  roleGuard('user', 'admin', 'superadmin'),
  getAllOrders,
);
OrderRouter.get(
  '/new',
  authGuard,
  roleGuard('user', 'admin', 'superadmin'),
  getCreateOrderPage,
);
OrderRouter.post(
  '/new',
  authGuard,
  roleGuard('user', 'admin', 'superadmin'),
  validate(orderValidate),
  createOrder,
);
OrderRouter.get(
  '/:id',
  authGuard,
  roleGuard('user', 'admin', 'superadmin'),
  getOrderById,
);
// OrderRouter.get('/:id/edit', authGuard, roleGuard('user', 'admin', 'superadmin'), getEditOrderPage);
// OrderRouter.post('/:id/edit', authGuard, roleGuard('user','admin', 'superadmin'), validate(orderUpdate), updateOrder);
// OrderRouter.post('/:id/delete', authGuard, roleGuard('admin', 'superadmin'), deleteOrder);
