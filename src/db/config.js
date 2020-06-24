const mongoose = require('mongoose');
const { mongodb } = require('./keys');

mongoose.set('useFindAndModify', false);

exports.initDb = (cb) => {
  mongoose.connect(mongodb.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('DB is connected');
    cb();
  }).catch(err => {
    console.log('Proccess envvvvvv julioooooooo',mongodb.URI);
    console.log('juliooooooooooooooo', err)
  });
};
