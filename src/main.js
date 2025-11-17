import express from 'express';
import { MainRouter } from './routers/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { config } from './config/index.js';
import  {createDefaultAdmins}  from './helpers/defaultAdmins.js';
import morgan from 'morgan';
import { logger } from './utils/logger.js';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const PORT = config.db.PORT || 5050;
createDefaultAdmins()
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(express.static(path.join(process.cwd(), 'src', 'public')));
app.use('/', MainRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`SERVER IS RUNNING ON PORT ${PORT}`);
});
