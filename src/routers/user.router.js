import {Router} from "express"
import { authGuard } from "../middleware/authGuard.js"
import {roleGuard} from "../middleware/roleGuard.js"
import {createUser, getAllUsers, getCreateUserPage, getEditUserPage, updateUser, deleteUser, getUserById} from "../controllers/user.controller.js"
import { validate } from "../middleware/validate.js"
import { userValidate, userUpdate } from "../validations/user.validation.js"


export const UserRouter = Router()
UserRouter.get('/', authGuard, roleGuard('user', 'admin', 'superadmin'), getAllUsers)
UserRouter.get('/new', authGuard, roleGuard('admin', 'superadmin'), getCreateUserPage)
UserRouter.post('/new', authGuard, roleGuard( 'admin', 'superadmin'), validate(userValidate), createUser)
UserRouter.get('/:id', authGuard, roleGuard( 'user', 'admin', 'superadmin'), getUserById)
UserRouter.get('/:id/edit', authGuard, roleGuard('admin', 'superadmin'), getEditUserPage);
UserRouter.post('/:id/edit', authGuard, roleGuard('admin', 'superadmin'), validate(userUpdate), updateUser);

UserRouter.post('/:id/delete', authGuard, roleGuard('admin', 'superadmin'), deleteUser);