import {Router} from "express"
import { authGuard } from "../middleware/authGuard.js"
import {roleGuard} from "../middleware/roleGuard.js"
import {createBook, getAllBooks, getCreateBookPage, getEditBookPage, updateBook, deleteBook} from "../controllers/book.controller.js"
import { getBookById } from "../controllers/book.controller.js"
import { validate } from "../middleware/validate.js"
import { bookValidate, bookUpdate } from "../validations/book.validation.js"

export const BookRouter = Router()
BookRouter.get('/', authGuard, roleGuard('user', 'admin', 'superadmin'), getAllBooks)
BookRouter.get('/new', authGuard, roleGuard('admin', 'superadmin'), getCreateBookPage)
BookRouter.post('/new', authGuard, roleGuard( 'admin', 'superadmin'), validate(bookValidate), createBook)
BookRouter.get('/:id', authGuard, roleGuard('user', 'admin', 'superadmin'), getBookById)
BookRouter.get('/:id/edit', authGuard, roleGuard('admin', 'superadmin'), getEditBookPage);
BookRouter.post('/:id/edit', authGuard, roleGuard('admin', 'superadmin'), validate(bookUpdate), updateBook);

BookRouter.post('/:id/delete', authGuard, roleGuard('admin', 'superadmin'), deleteBook);

