import express from "express"
import {MainRouter} from "./routers/index.js"
import {errorHandler} from "./middleware/errorHandler.js"
import {config} from "./config/index.js"
import morgan from "morgan"
import {logger} from "./utils/logger.js"
import path from "path"
import expressLayouts from "express-ejs-layouts";
// import session from 'express-session';
// import flash from 'connect-flash';
import "dotenv/config"
import cookieParser from 'cookie-parser'


const PORT = config.db.PORT || 5050
const app = express()
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));
app.use(expressLayouts)
app.set("layout", "layouts/main"); // default layout file
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser)
app.use(morgan('tiny'))
app.use(express.static(path.join(process.cwd(), 'src', 'public')));
app.use('/', MainRouter)
app.use(errorHandler)


// app.use(session({
//   secret: config.jwt.accessSecret,
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(flash());
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.user = req.user || null;
//   next();
// });

app.listen(PORT, ()=>{
    logger.info(`SERVER IS RUNNING ON PORT ${PORT}`)
})