import { ApiError } from '../helpers/errorMessage.js';
import { UserService } from '../services/users.service.js';
import db from '../db/knex.js';

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const users = await UserService.getAll({ page, limit, query: req.query.query });

    const [countResult] = await db('users').count('id as count');
    const totalUsers = parseInt(countResult.count);
    const totalPages = Math.ceil(totalUsers / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };

    res.render('users/getAllUsers', {
      user: req.user ,
      users,
      message: users.length > 0 ? 'SUCCESSFULLY RETRIEVED ALL USERS' : 'NO USER FOUND',
      errors: null,
      pagination,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/users/getAllUsers',
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getById(id);

    return res.render('users/getOneUser', {
      message: 'SUCCESSFULLY RETRIEVED ONE USER FROM DATABASE',
      title: 'SEARCHED USER',
      user: user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user ,
      redirect: '/Users/getAllUsers',
    });
  }
};

const getCreateUserPage = async (req, res) => {
  return res.render('users/createUser', {
    message: null,
    data: { email: '', username: '', password: '', last_name: '', first_name: '', phone_number: '', address: '', role: ''},
    title: 'CREATE A NEW USER',
    user: req.user || null,
    errors: null,
  });
};

const createUser = async (req, res) => {
  try {
    const newUser = await UserService.create(req.validatedData);
    return res.render('users/createUser', {
      message: 'SUCCESSFULLY CREATED A USER!',
      data: newUser,
      title: 'A NEW USER',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('users/createUser', {
        title: 'CREATE A NEW USER',
        message: null,
        data: req.validatedData || null,
        user: req.user || null,
        errors: formattedErrors,
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user || null,
      redirect: '/users/getAllUsers',
    });
  }
};

const getEditUserPage = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getById(id);

    return res.render('users/createUser', {
      message: null,
      data: user,
      title: 'EDIT User',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user ,
      redirect: '/users',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await UserService.update(id, req.validatedData);

    if (!updated) throw new ApiError(404, 'User not found');

    return res.render('users/createUser', {
      message: 'User updated successfully!',
      data: updated,
      title: 'EDIT User',
      user: req.user ,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('users/createUser', {
        message: null,
        data: req.validatedData,
        title: 'EDIT User',
        user: req.user ,
        errors: formattedErrors,
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user ,
      redirect: '/users',
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserService.remove(id);
    if (!deleted) throw new ApiError(404, 'User not found');
    return res.redirect('/users');
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/users',
    });
  }
};

export {
  getAllUsers,
  getUserById,
  getCreateUserPage,
  getEditUserPage,
  createUser,
  updateUser,
  deleteUser,
};
