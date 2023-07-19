import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const createLogger = () => {
  const transports = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
  ];

  const config = {
    format: winston.format.uncolorize(),
    transports: [...transports],
  };

  if (process.env.NODE_ENV !== 'production') {
    WinstonModule.createLogger({
      format: winston.format.simple(),
      transports: [...transports],
    });
  }

  return WinstonModule.createLogger(config);
};
