import express from "express"
import {MainRouter} from "./routers/index.js"
import {errorHandler} from "./middleware/errorHandler.js"
import {config} from "./config/index.js"
import morgan from "morgan"
import {logger} from "./utils/logger.js"
import "dotenv/config"


const PORT = config.db.PORT
const app = express()
app.use(express.json())
app.use(morgan('tiny'))
app.use('/', MainRouter)
app.use(errorHandler)

app.listen(PORT, ()=>{
    logger.info(`SERVER IS RUNNING ON PORT ${PORT}`)
})