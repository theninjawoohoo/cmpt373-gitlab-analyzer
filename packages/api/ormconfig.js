module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
