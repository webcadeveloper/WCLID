module.exports = {
  development: {
    url: 'postgresql://neondb_owner:3pYifFQzv4Wg@ep-green-shadow-a612icip.us-west-2.aws.neon.tech/neondb?sslmode=require',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  // Otras configuraciones para diferentes entornos (por ejemplo, test, production) si es necesario
};