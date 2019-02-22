const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const authCtrl = require('./auth');
// const middleware = require('./middleware');
const dbConfig = require('./db/config');
const routes = require('./routes/index');

// initializations
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.set('port', 443);

// routes
app.use('/', routes);

// Starting the server
dbConfig.initDb(() => {
  app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
  });
});
