export default () => ({
  jwtSigningKey: process.env.JWT_SIGNING_KEY || 'localdev',
  jwtAuthExpiryPeriod: process.env.JWT_AUTH_EXPIRY_PERIOD || '24h',
  sfuAuthFrontEndService:
    process.env.SFU_AUTH_FRONT_END_SERVICE || 'http://localhost:3000/login/sfu',
  sfuValidationEndpoint:
    process.env.SFU_VALIDATION_ENDPOINT ||
    'https://cas.sfu.ca/cas/serviceValidate',
  database: {
    type: process.env.TYPEORM_CONNECTION || 'postgres',
    host: process.env.TYPEORM_HOST || 'localhost',
    port: parseInt(process.env.TYPEORM_PORT, 10) || 5433,
    database: process.env.TYPEORM_DATABASE || 'postgres',
    username: process.env.TYPEORM_USERNAME || 'postgres',
    password: process.env.TYPEORM_PASSWORD || 'postgres',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
      migrationsDir: 'src/migrations',
    },
  },
});
