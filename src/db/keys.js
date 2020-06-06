const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mongodb: {
    URI: isProd ? 'mongodb://mongo:27017/veci-app' : 'mongodb://localhost:27017/veci-app'
  }
};
