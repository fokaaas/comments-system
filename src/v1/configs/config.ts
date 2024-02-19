import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  frontBaseUrl: process.env.FRONT_BASE_URL,
  smtp: {
    host: process.env.SMTP_HOST,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
  jwt: {
    secret: process.env.SECREST,
    accessTtl: process.env.ACCESS_TTL,
    refreshTtl: process.env.REFRESH_TTL,
  },
});
