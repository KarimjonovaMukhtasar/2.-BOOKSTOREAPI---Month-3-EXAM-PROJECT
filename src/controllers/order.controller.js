import { OrderService } from '../services/orders.service.js';
import db from '../db/knex.js';

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const orders = await OrderService.getAll({
      page,
      limit,
      query: req.query.query,
    });

    const [countResult] = await db('orders').count('id as count');
    const totalOrders = parseInt(countResult.count);
    const totalPages = Math.ceil(totalOrders / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };

    res.render('orders/getAllOrders', {
      user: req.user,
      orders,
      message:
        orders.length > 0
          ? 'SUCCESSFULLY RETRIEVED ALL Orders'
          : 'NO Order FOUND',
      errors: null,
      pagination,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/orders/getAllOrders',
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getById(id);

    return res.render('orders/getOneOrder', {
      message: 'SUCCESSFULLY RETRIEVED ONE Order FROM DATABASE',
      order,
      title: 'SEARCHED Order',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: `/orders`,
    });
  }
};

const getCreateOrderPage = async (req, res) => {
  return res.render('orders/createOrder', {
    message: null,
    data: { user_id: req.user.id, items: '', total_price: '' },
    title: 'CREATE A NEW Order',
    user: req.user,
    errors: null,
  });
};

const createOrder = async (req, res) => {
  try {
    const data = { ...req.validatedData, user_id: req.user.id };
    const newOrder = await OrderService.create(data);
    return res.render('orders/createOrder', {
      message: 'SUCCESSFULLY CREATED AN Order!',
      data: newOrder,
      title: 'A NEW Order',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('orders/createOrder', {
        title: 'CREATE A NEW Order',
        message: null,
        data: req.validatedData ,
        user: req.user,
        errors: formattedErrors,
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/orders/createOrder',
    });
  }
};
export { getAllOrders, getOrderById, getCreateOrderPage, createOrder };
