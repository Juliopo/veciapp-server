const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const authCtrl = require('./auth');
// const middleware = require('./middleware');
const dbConfig = require('./db/config');
const routes = require('./routes/index');

// initializations
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('port', 3000);

// routes
app.use('/', routes);

// Starting the server
dbConfig.initDb(() => {
  app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
  });
});
