export default () => ({
  database: {
    type: process.env.TYPEORM_CONNECTION || 'postgres',
    host: process.env.TYPEORM_HOST || 'localhost',
    port: parseInt(process.env.TYPEORM_PORT, 10) || 5433,
    database: process.env.TYPEORM_DATABASE || 'postgres',
    username: process.env.TYPEORM_USERNAME || 'postgres',
    password: process.env.TYPEORM_PASSWORD || 'postgres',
  },
});
