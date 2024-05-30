const express = require('express');
global.validate = require('express-validation');
global.env = require('dotenv').config();
const app = express();
global.fs = require('fs');
global.stdCodes = require('./config/error_codes');//Error Codes Config File
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
global.moment = require('moment');
global.path = require('path');
global.logger = require('./config/logger');
global.async = require('async');
global.sqldb = require('./config/dbconnect');//To establish a connection to particular DB
global.dbutil = require('./utils/dbutils');//Execute Query

//global.email_service = require('./utils/mail_services'); //send a E-mail from AWS-SES //
app.use(useragent.express());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(function (req, res, next) {
  logger.info("Requested URL : ", req.url);
  logger.info(req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if ('OPTIONS' == req.method || req.url == '/favicon.ico') {
    return res.status(200).send('OK');
  } else {
    next();
  }
});

app.use(logErrors);
app.use('/', require('./routes/routes'));
app.use('/filestorage',express.static(path.join(__dirname,'/filestorage')))
app.use((err, req, res, next) => {
  if (err instanceof validate.ValidationError) {
    res.status(err.status).json(err);
  } else {
    res.status(500)
      .json({ 
        status: err.status,
        message: err.message
      });
  }
});
function logErrors(err, req, res, next) {
  logger.error(err.stack);
  next(err);
}
app.get('/login', function (req, res) {
  res.send("Cloud evolve API Server is listening");
});
app.get('/test', function (req, res) {
  res.send("Testing.......");
});
let server = app.listen(2525, function () {
 
  let [host,port]= [server.address().address,server.address().port];

  logger.debug('Cloud evolve API Server is listening at http://%s:%s', host, port);

});
