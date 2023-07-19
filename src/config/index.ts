import * as Joi from 'joi';

export const envSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required(),
  DATABASE_LOGGING: Joi.string().required(),
  PGHOST: Joi.string().required(),
  PGPORT: Joi.string().required(),
  PGUSER: Joi.string().required(),
  PGPASSWORD: Joi.string().required(),
  PGDATABASE: Joi.string().required(),
  PORT: Joi.string().required(),

  ENCRYPTION_KEY: Joi.string().required(),
  ENCRYPTION_ALGORITHM: Joi.string().required(),

  RABBIT_MQ_URI: Joi.string().required(),
  RABBIT_MQ_INVENTORY_QUEUE: Joi.string().required(),
  RABBIT_MQ_ORDER_QUEUE: Joi.string().required(),
  RABBIT_MQ_PAYMENT_QUEUE: Joi.string().required(),
  RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
  RABBIT_MQ_NOTIFICATION_QUEUE: Joi.string().required(),
});
