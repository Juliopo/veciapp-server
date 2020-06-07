const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dbConfig = require('./db/config');
const routes = require('./routes/index');

// const whiteList = [];
// const corsOptionsDelegate = (req, callback) => {
//   const corsOptions = {
//     credentials: true
//   };

//   if (whiteList.indexOf(req.header('Origin')) !== -1) {
//     corsOptions.origin = true; // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions.origin = false; // disable CORS for this request
//   }

//   callback(null, corsOptions); // callback expects two parameters: error and options
// };

// initializations
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.options('*', cors());
app.set('port', 80);

// routes
app.use('/', routes);

// Starting the server
dbConfig.initDb(() => {
  app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
  });
});
