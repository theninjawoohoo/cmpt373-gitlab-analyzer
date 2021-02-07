export default () => ({
  jwtSigningKey: process.env.JWT_SIGNING_KEY || 'localdev',
  jwtAuthExpiryPeriod: process.env.JWT_AUTH_EXPIRY_PERIOD || '24h',
  sfuAuthFrontEndService:
    process.env.SFU_AUTH_FRONT_END_SERVICE || 'http://localhost:3000/sfu',
  sfuValidationEndpoint:
    process.env.SFU_VALIDATION_ENDPOINT ||
    'https://cas.sfu.ca/cas/serviceValidate',
  gitlabBaseUrl:
    process.env.GITLAB_BASE_URL ||
    'http://cmpt373-1211-08.cmpt.sfu.ca:5000/api/v4',
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
