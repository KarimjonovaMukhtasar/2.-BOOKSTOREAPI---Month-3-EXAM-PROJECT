import winston from 'winston';
const { combine, timestamp, printf, colorize, align, json } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        json(),
      ),
    }),
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        json(),
      ),
    }),
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        json(),
      ),
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

export default logger;
