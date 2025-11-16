import {Router} from "express"
import { LoginRouter, RegisterRouter } from "./auth.router.js"

export const MainRouter = Router()
MainRouter.use('/auth/signin', LoginRouter)
MainRouter.use('/auth/signup', RegisterRouter)
