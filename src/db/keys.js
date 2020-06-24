const mongoUsr = process.env.MONGO_APP_USERNAME;
const mongoPsw = process.env.MONGO_APP_PASSWORD;
const mongoDb = process.env.MONGO_INITDB_DATABASE;
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mongodb: {
    URI: isProd ? `mongodb://${mongoUsr}:${mongoPsw}@mongo:27017/${mongoDb}` : `mongodb://${mongoUsr}:${mongoPsw}@localhost:27017/${mongoDb}`
  }
};
